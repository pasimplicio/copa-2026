// Domínio do mata-mata da Copa 2026

export type Phase = "R32" | "R16" | "QF" | "SF" | "F";

export const PHASES: Phase[] = ["R32", "R16", "QF", "SF", "F"];

export const PHASE_LABEL: Record<Phase, string> = {
  R32: "16-avos de final",
  R16: "Oitavas de final",
  QF: "Quartas de final",
  SF: "Semifinais",
  F: "Final",
};

export const PHASE_SHORT: Record<Phase, string> = {
  R32: "16-avos",
  R16: "Oitavas",
  QF: "Quartas",
  SF: "Semi",
  F: "Final",
};

export type Status =
  | "WAITING" // faltam times
  | "READY" // dois times definidos, sem resultado
  | "FINISHED" // decidido no tempo normal
  | "FINISHED_ET" // decidido na prorrogação
  | "FINISHED_PEN"; // decidido nos pênaltis

export interface Team {
  id: string;
  name: string;
  abbr: string; // sigla de 3 letras (ex.: "BRA", "HOL")
  code: string; // ISO 3166-1 (ex.: "br", "gb-eng") para flag-icons
  strength: number; // 1..100, usado na simulação
}

export interface Match {
  id: string;
  phase: Phase;
  order: number; // posição na coluna
  homeId: string | null;
  awayId: string | null;
  // tempo normal
  homeGoals: number | null;
  awayGoals: number | null;
  // prorrogação
  homeET: number | null;
  awayET: number | null;
  // pênaltis
  homePen: number | null;
  awayPen: number | null;
  status: Status;
  winnerId: string | null;
  feedsTo: string | null; // id da partida da próxima fase
  feedSlot: "home" | "away"; // posição que o vencedor ocupará
}
