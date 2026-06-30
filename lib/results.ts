import type { ResultInput } from "./engine";

// Resultado vindo de fonte externa (API), já mapeado para ids internos.
export interface ExternalResult {
  homeId: string;
  awayId: string;
  input: ResultInput;
}

// Snapshot dos resultados REAIS já confirmados das 16-avos da Copa 2026.
// Atualizar este arquivo conforme novos jogos forem disputados.
// Chave = id da partida (ver lib/bracket.ts; R32-0 = jogo 73, ...).
export const RESULTS_UPDATED = "2026-06-30";
export const RESULTS_SOURCE = "Wikipedia — 2026 FIFA World Cup knockout stage";

export const REAL_RESULTS: Record<string, ResultInput> = {
  // África do Sul 0–1 Canadá
  "R32-0": { homeGoals: 0, awayGoals: 1 },
  // Alemanha 1–1 Paraguai (Paraguai venceu nos pênaltis 4–3)
  "R32-1": { homeGoals: 1, awayGoals: 1, homeET: 0, awayET: 0, homePen: 3, awayPen: 4 },
  // Holanda 1–1 Marrocos (Marrocos venceu nos pênaltis 3–2)
  "R32-2": { homeGoals: 1, awayGoals: 1, homeET: 0, awayET: 0, homePen: 2, awayPen: 3 },
  // Brasil 2–1 Japão
  "R32-3": { homeGoals: 2, awayGoals: 1 },
};
