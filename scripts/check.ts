import { createBracket } from "../lib/bracket";
import { decide, isFinished, simulateMatch } from "../lib/engine";
import { PHASES } from "../lib/types";
import type { Match } from "../lib/types";

function propagate(map: Record<string, Match>, m: Match) {
  if (!m.feedsTo) return;
  const next = map[m.feedsTo];
  const field = m.feedSlot === "home" ? "homeId" : "awayId";
  if (next[field] === m.winnerId) return;
  next[field] = m.winnerId;
}

let fail = 0;
const ok = (c: boolean, msg: string) => {
  console.log((c ? "✓" : "✗") + " " + msg);
  if (!c) fail++;
};

// CA01
const b = createBracket();
ok(b.length === 31, `CA01: 31 partidas (got ${b.length})`);
ok(b.filter((m) => m.phase === "R32").length === 16, "16-avos = 16 jogos");
ok(b.filter((m) => m.phase === "R16").length === 8, "Oitavas = 8 jogos");
ok(b.filter((m) => m.phase === "QF").length === 4, "Quartas = 4 jogos");
ok(b.filter((m) => m.phase === "SF").length === 2, "Semis = 2 jogos");
ok(b.filter((m) => m.phase === "F").length === 1, "Final = 1 jogo");

// R32 todos com 2 times (32 seleções)
const r32 = b.filter((m) => m.phase === "R32");
ok(
  r32.every((m) => m.homeId && m.awayId),
  "R32 semeada: 32 seleções posicionadas",
);

// CA04: empate exige decisão
ok(
  decide({ homeId: "a", awayId: "b", homeGoals: 1, awayGoals: 1, homeET: null, awayET: null, homePen: null, awayPen: null }).needs === "ET",
  "CA04: 1x1 normal → exige prorrogação",
);
ok(
  decide({ homeId: "a", awayId: "b", homeGoals: 1, awayGoals: 1, homeET: 0, awayET: 0, homePen: null, awayPen: null }).needs === "PEN",
  "CA04: empate na prorrogação → exige pênaltis",
);
ok(
  decide({ homeId: "a", awayId: "b", homeGoals: 1, awayGoals: 1, homeET: 1, awayET: 0, homePen: null, awayPen: null }).winnerId === "a",
  "Prorrogação decide (2x1 total)",
);
ok(
  decide({ homeId: "a", awayId: "b", homeGoals: 0, awayGoals: 0, homeET: 0, awayET: 0, homePen: 4, awayPen: 3 }).winnerId === "a",
  "Pênaltis decide (4x3)",
);

// CA05: simular tudo preenche e gera campeão
const t0 = Date.now();
const map: Record<string, Match> = Object.fromEntries(b.map((m) => [m.id, m]));
for (const phase of PHASES) {
  for (const m of b.filter((x) => x.phase === phase).sort((a, c) => a.order - c.order)) {
    if (m.homeId && m.awayId && !isFinished(m.status)) {
      const r = simulateMatch(m.homeId, m.awayId);
      Object.assign(m, {
        homeGoals: r.homeGoals,
        awayGoals: r.awayGoals,
        homeET: r.homeET ?? null,
        awayET: r.awayET ?? null,
        homePen: r.homePen ?? null,
        awayPen: r.awayPen ?? null,
      });
      const d = decide(m);
      m.winnerId = d.winnerId;
      m.status = d.status;
      propagate(map, m);
    }
  }
}
const dt = Date.now() - t0;
ok(dt < 3000, `CA05: simulação < 3s (${dt}ms)`);
ok(b.every((m) => isFinished(m.status)), "CA05: todos os 31 jogos finalizados");

const champion = b.find((m) => m.phase === "F")!.winnerId;
ok(!!champion, "CA05: campeão definido");

// CA09: caminho do campeão
const path = b.filter((m) => m.winnerId === champion);
ok(path.length === 5, `Caminho do campeão = 5 vitórias (R32→Final) (got ${path.length})`);

console.log(fail === 0 ? "\nTODOS OS TESTES PASSARAM ✅" : `\n${fail} FALHAS ❌`);
process.exit(fail === 0 ? 0 : 1);
