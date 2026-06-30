import type { Match, Phase } from "./types";

// Quantidade de partidas por fase: 16 + 8 + 4 + 2 + 1 = 31
const PHASE_MATCHES: { phase: Phase; count: number }[] = [
  { phase: "R32", count: 16 },
  { phase: "R16", count: 8 },
  { phase: "QF", count: 4 },
  { phase: "SF", count: 2 },
  { phase: "F", count: 1 },
];

// Confrontos REAIS das 16-avos de final (Round of 32) da Copa do Mundo 2026,
// jogos 73 a 88, na ordem oficial do chaveamento.
// Fonte: Wikipedia / FIFA — 2026 FIFA World Cup knockout stage.
export const REAL_R32: [string, string][] = [
  ["rsa", "can"], // 73 · 2ºA África do Sul × 2ºB Canadá
  ["ger", "par"], // 74 · 1ºE Alemanha × 3º Paraguai
  ["ned", "mar"], // 75 · 1ºF Holanda × 2ºC Marrocos
  ["bra", "jpn"], // 76 · 1ºC Brasil × 2ºF Japão
  ["fra", "swe"], // 77 · 1ºI França × 3º Suécia
  ["civ", "nor"], // 78 · 2ºE Costa do Marfim × 2ºI Noruega
  ["mex", "ecu"], // 79 · 1ºA México × 3º Equador
  ["eng", "cod"], // 80 · 1ºL Inglaterra × 3º RD Congo
  ["usa", "bih"], // 81 · 1ºD Estados Unidos × 3º Bósnia e Herzegovina
  ["bel", "sen"], // 82 · 1ºG Bélgica × 3º Senegal
  ["por", "cro"], // 83 · 2ºK Portugal × 2ºL Croácia
  ["esp", "aut"], // 84 · 1ºH Espanha × 2ºJ Áustria
  ["sui", "alg"], // 85 · 1ºB Suíça × 3º Argélia
  ["arg", "cpv"], // 86 · 1ºJ Argentina × 2ºH Cabo Verde
  ["col", "gha"], // 87 · 1ºK Colômbia × 3º Gana
  ["aus", "egy"], // 88 · 2ºD Austrália × 2ºG Egito
];

// Emparelhamento OFICIAL das oitavas (jogos 89–96). Cada oitava recebe os
// vencedores de dois jogos das 16-avos, identificados pelo índice em REAL_R32
// (0 = jogo 73, ..., 15 = jogo 88). NÃO é sequencial — segue o chaveamento FIFA.
//   89: W74×W77 · 90: W73×W75 · 91: W76×W78 · 92: W79×W80
//   93: W81×W82 · 94: W83×W84 · 95: W86×W88 · 96: W85×W87
const R16_FROM_R32: [number, number][] = [
  [1, 4], // R16-0 (jogo 89): Alemanha/Paraguai × França/Suécia
  [0, 2], // R16-1 (jogo 90): África do Sul/Canadá × Holanda/Marrocos
  [3, 5], // R16-2 (jogo 91): Brasil/Japão × Costa do Marfim/Noruega
  [6, 7], // R16-3 (jogo 92): México/Equador × Inglaterra/RD Congo
  [8, 9], // R16-4 (jogo 93): EUA/Bósnia × Bélgica/Senegal
  [10, 11], // R16-5 (jogo 94): Portugal/Croácia × Espanha/Áustria
  [13, 15], // R16-6 (jogo 95): Argentina/Cabo Verde × Austrália/Egito
  [12, 14], // R16-7 (jogo 96): Suíça/Argélia × Colômbia/Gana
];

// Para cada partida das 16-avos (por order), em qual oitava e slot o vencedor entra.
function r32FeedMap(): Record<number, { to: number; slot: "home" | "away" }> {
  const map: Record<number, { to: number; slot: "home" | "away" }> = {};
  R16_FROM_R32.forEach(([home, away], r16Index) => {
    map[home] = { to: r16Index, slot: "home" };
    map[away] = { to: r16Index, slot: "away" };
  });
  return map;
}

// Gera as 31 partidas vazias, já ligadas (feedsTo/feedSlot) e com a primeira
// fase preenchida com os confrontos reais das 16-avos.
export function createBracket(): Match[] {
  const matches: Match[] = [];
  const r32Feed = r32FeedMap();

  for (const { phase, count } of PHASE_MATCHES) {
    for (let order = 0; order < count; order++) {
      let feedsTo: string | null = null;
      let feedSlot: "home" | "away" = "home";

      if (phase === "R32") {
        // 16-avos → oitavas: mapeamento oficial (não sequencial)
        const f = r32Feed[order];
        feedsTo = `R16-${f.to}`;
        feedSlot = f.slot;
      } else if (phase === "QF") {
        // quartas → semifinais: cruzamento OFICIAL (não sequencial).
        // Semi A (SF-0) = QF-0 + QF-2  (lado Alemanha/França/Espanha/Portugal)
        // Semi B (SF-1) = QF-1 + QF-3  (lado Brasil/Argentina/Inglaterra)
        // Mantém Brasil e França em metades opostas — só se encontram na final.
        feedsTo = `SF-${order % 2}`;
        feedSlot = order < 2 ? "home" : "away";
      } else {
        // oitavas → quartas e semi → final: sequencial (order k → próxima k/2)
        const next = nextPhaseOf(phase);
        if (next) {
          feedsTo = `${next}-${Math.floor(order / 2)}`;
          feedSlot = order % 2 === 0 ? "home" : "away";
        }
      }

      matches.push({
        id: `${phase}-${order}`,
        phase,
        order,
        homeId: null,
        awayId: null,
        homeGoals: null,
        awayGoals: null,
        homeET: null,
        awayET: null,
        homePen: null,
        awayPen: null,
        status: "WAITING",
        winnerId: null,
        feedsTo,
        feedSlot,
      });
    }
  }

  // 16-avos com os confrontos reais
  const r32 = matches.filter((m) => m.phase === "R32");
  for (let i = 0; i < 16; i++) {
    r32[i].homeId = REAL_R32[i][0];
    r32[i].awayId = REAL_R32[i][1];
    r32[i].status = "READY";
  }

  return matches;
}

function nextPhaseOf(phase: Phase): Phase | null {
  const order: Phase[] = ["R32", "R16", "QF", "SF", "F"];
  const idx = order.indexOf(phase);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
}
