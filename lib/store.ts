import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Match } from "./types";
import { createBracket } from "./bracket";
import { decide, type ResultInput } from "./engine";
import { REAL_RESULTS, type ExternalResult } from "./results";

interface BracketState {
  matches: Match[];
  submitResult: (matchId: string, input: ResultInput) => void;
  loadRealResults: () => void;
  applyExternal: (results: ExternalResult[]) => number;
  reset: () => void;
}

function swapInput(i: ResultInput): ResultInput {
  return {
    homeGoals: i.awayGoals,
    awayGoals: i.homeGoals,
    homeET: i.awayET ?? null,
    awayET: i.homeET ?? null,
    homePen: i.awayPen ?? null,
    awayPen: i.homePen ?? null,
  };
}

type MatchMap = Record<string, Match>;

function clearResult(m: Match) {
  m.homeGoals = null;
  m.awayGoals = null;
  m.homeET = null;
  m.awayET = null;
  m.homePen = null;
  m.awayPen = null;
  m.winnerId = null;
  m.status = m.homeId && m.awayId ? "READY" : "WAITING";
}

// Empurra o vencedor para a próxima fase. Se o time que entra mudou,
// invalida o resultado seguinte e propaga a limpeza em cascata.
function propagate(map: MatchMap, m: Match) {
  if (!m.feedsTo) return;
  const next = map[m.feedsTo];
  if (!next) return;
  const field = m.feedSlot === "home" ? "homeId" : "awayId";
  const newTeam = m.winnerId;
  if (next[field] === newTeam) return;
  next[field] = newTeam;
  clearResult(next);
  if (next.status === "WAITING" && !(next.homeId && next.awayId)) {
    next.status = "WAITING";
  }
  propagate(map, next);
}

function setScores(m: Match, input: ResultInput) {
  m.homeGoals = input.homeGoals;
  m.awayGoals = input.awayGoals;
  m.homeET = input.homeET ?? null;
  m.awayET = input.awayET ?? null;
  m.homePen = input.homePen ?? null;
  m.awayPen = input.awayPen ?? null;
  const d = decide(m);
  m.winnerId = d.winnerId;
  m.status = d.status;
}

export const useBracket = create<BracketState>()(
  persist(
    (set) => ({
      matches: createBracket(),

      submitResult: (matchId, input) =>
        set((state) => {
          const matches = state.matches.map((m) => ({ ...m }));
          const map: MatchMap = Object.fromEntries(matches.map((m) => [m.id, m]));
          const m = map[matchId];
          if (!m || !m.homeId || !m.awayId) return {};
          setScores(m, input);
          propagate(map, m);
          return { matches };
        }),

      // Aplica o snapshot de resultados reais já confirmados (ver lib/results.ts),
      // propagando os vencedores. Partidas ainda não disputadas ficam intactas.
      loadRealResults: () =>
        set((state) => {
          const matches = state.matches.map((m) => ({ ...m }));
          const map: MatchMap = Object.fromEntries(matches.map((m) => [m.id, m]));
          for (const [id, input] of Object.entries(REAL_RESULTS)) {
            const m = map[id];
            if (!m || !m.homeId || !m.awayId) continue;
            setScores(m, input);
            propagate(map, m);
          }
          return { matches };
        }),

      // Aplica resultados externos casando cada um ao confronto pelo PAR de
      // seleções (em qualquer orientação). Repete em passes para que, após
      // propagar os vencedores, os jogos das fases seguintes também sejam
      // preenchidos. Retorna quantos confrontos foram aplicados.
      applyExternal: (list) => {
        let applied = 0;
        set((state) => {
          const matches = state.matches.map((m) => ({ ...m }));
          const map: MatchMap = Object.fromEntries(matches.map((m) => [m.id, m]));
          const used = new Set<string>();
          let progress = true;
          while (progress) {
            progress = false;
            for (const r of list) {
              const m = matches.find(
                (mm) =>
                  !used.has(mm.id) &&
                  mm.homeId &&
                  mm.awayId &&
                  ((mm.homeId === r.homeId && mm.awayId === r.awayId) ||
                    (mm.homeId === r.awayId && mm.awayId === r.homeId)),
              );
              if (!m) continue;
              const input = m.homeId === r.homeId ? r.input : swapInput(r.input);
              setScores(m, input);
              propagate(map, m);
              used.add(m.id);
              applied++;
              progress = true;
            }
          }
          return { matches };
        });
        return applied;
      },

      reset: () => set({ matches: createBracket() }),
    }),
    {
      name: "copa-2026-bracket",
      version: 3, // v3: emparelhamento oficial das oitavas (não sequencial)
      migrate: () => ({ matches: createBracket() }),
    },
  ),
);
