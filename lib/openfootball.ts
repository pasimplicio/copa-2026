import { idFromApiName } from "./teamAliases";
import type { ExternalResult } from "./results";

// Estrutura (parcial) do worldcup.json da openfootball.
interface OFTeam {
  name?: string;
}
interface OFMatch {
  round: string;
  team1: string | OFTeam;
  team2: string | OFTeam;
  score?: {
    ft?: [number | null, number | null];
    et?: [number | null, number | null]; // total após prorrogação
    p?: [number | null, number | null]; // pênaltis
  };
}
export interface OpenFootball {
  name?: string;
  matches: OFMatch[];
}

// Fases eliminatórias que existem no nosso chaveamento (exclui "Match for third place").
const KO_ROUNDS = new Set([
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Final",
]);

function teamName(t: string | OFTeam): string {
  return typeof t === "string" ? t : t?.name ?? "";
}

// Converte o JSON da openfootball em resultados internos (apenas jogos do
// mata-mata já disputados e com ambas as seleções mapeáveis).
export function parseOpenFootball(data: OpenFootball): ExternalResult[] {
  const out: ExternalResult[] = [];
  for (const m of data.matches ?? []) {
    if (!KO_ROUNDS.has(m.round)) continue;
    const ft = m.score?.ft;
    if (!ft || ft[0] == null || ft[1] == null) continue; // ainda não disputado

    const homeId = idFromApiName(teamName(m.team1));
    const awayId = idFromApiName(teamName(m.team2));
    if (!homeId || !awayId) continue;

    const input: ExternalResult["input"] = {
      homeGoals: ft[0],
      awayGoals: ft[1],
    };

    const et = m.score?.et;
    if (et && et[0] != null && et[1] != null) {
      // et é o total após a prorrogação → gols da prorrogação = et − ft
      input.homeET = Math.max(0, et[0] - ft[0]);
      input.awayET = Math.max(0, et[1] - ft[1]);
    }
    const p = m.score?.p;
    if (p && p[0] != null && p[1] != null) {
      input.homePen = p[0];
      input.awayPen = p[1];
    }

    out.push({ homeId, awayId, input });
  }
  return out;
}
