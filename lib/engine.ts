import type { Match, Status } from "./types";
import { TEAMS_BY_ID } from "./teams";

export interface ResultInput {
  homeGoals: number;
  awayGoals: number;
  homeET?: number | null;
  awayET?: number | null;
  homePen?: number | null;
  awayPen?: number | null;
}

export type Needs = "ET" | "PEN" | null;

export interface Decision {
  winnerId: string | null;
  status: Status;
  needs: Needs; // o que ainda falta para decidir (null = decidido)
}

// Decide o resultado a partir dos campos preenchidos, aplicando o regulamento:
// tempo normal → prorrogação → pênaltis.
export function decide(m: {
  homeId: string | null;
  awayId: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
  homeET: number | null;
  awayET: number | null;
  homePen: number | null;
  awayPen: number | null;
}): Decision {
  if (m.homeGoals == null || m.awayGoals == null) {
    return { winnerId: null, status: "READY", needs: null };
  }
  // 1) Tempo normal
  if (m.homeGoals !== m.awayGoals) {
    return {
      winnerId: m.homeGoals > m.awayGoals ? m.homeId : m.awayId,
      status: "FINISHED",
      needs: null,
    };
  }
  // Empate no normal → prorrogação obrigatória
  if (m.homeET == null || m.awayET == null) {
    return { winnerId: null, status: "READY", needs: "ET" };
  }
  // 2) Prorrogação (gols somados ao tempo normal)
  const ht = m.homeGoals + m.homeET;
  const at = m.awayGoals + m.awayET;
  if (ht !== at) {
    return {
      winnerId: ht > at ? m.homeId : m.awayId,
      status: "FINISHED_ET",
      needs: null,
    };
  }
  // Empate na prorrogação → pênaltis
  if (m.homePen == null || m.awayPen == null || m.homePen === m.awayPen) {
    return { winnerId: null, status: "READY", needs: "PEN" };
  }
  // 3) Pênaltis
  return {
    winnerId: m.homePen > m.awayPen ? m.homeId : m.awayId,
    status: "FINISHED_PEN",
    needs: null,
  };
}

export function isFinished(status: Status): boolean {
  return (
    status === "FINISHED" ||
    status === "FINISHED_ET" ||
    status === "FINISHED_PEN"
  );
}

// ---------- Simulação automática ----------

function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// Simula um placar e devolve um resultado completo já decidido.
export function simulateMatch(homeId: string, awayId: string): ResultInput {
  const sh = TEAMS_BY_ID[homeId]?.strength ?? 70;
  const sa = TEAMS_BY_ID[awayId]?.strength ?? 70;
  const lambdaH = 0.9 + 1.7 * (sh / (sh + sa));
  const lambdaA = 0.9 + 1.7 * (sa / (sh + sa));

  let homeGoals = poisson(lambdaH);
  let awayGoals = poisson(lambdaA);

  const result: ResultInput = { homeGoals, awayGoals };

  if (homeGoals === awayGoals) {
    // Prorrogação
    const homeET = poisson(0.35);
    const awayET = poisson(0.35);
    result.homeET = homeET;
    result.awayET = awayET;
    if (homeGoals + homeET === awayGoals + awayET) {
      // Pênaltis — garante vencedor, com leve viés pela força
      let hp: number;
      let ap: number;
      do {
        hp = 3 + poisson(1.2) + (Math.random() < sh / (sh + sa) ? 1 : 0);
        ap = 3 + poisson(1.2) + (Math.random() < sa / (sh + sa) ? 1 : 0);
      } while (hp === ap);
      result.homePen = hp;
      result.awayPen = ap;
    }
  }

  return result;
}
