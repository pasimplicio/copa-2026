"use client";

import type { Match } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { isFinished } from "@/lib/engine";
import { kickoff } from "@/lib/schedule";

interface BracketMatchProps {
  match: Match;
  onOpen: (m: Match) => void;
  side: "left" | "right";
}

function Side({
  teamId,
  winnerId,
  decided,
  align,
  score,
  pen,
}: {
  teamId: string | null;
  winnerId: string | null;
  decided: boolean;
  align: "left" | "right";
  score: number | null;
  pen: number | null;
}) {
  const team = getTeam(teamId);
  const isWinner = !!winnerId && winnerId === teamId;
  const tone = isWinner ? "text-win" : decided ? "text-muted" : "text-text";

  return (
    <div
      className={`flex items-center gap-1.5 ${
        align === "right" ? "flex-row-reverse" : ""
      } ${decided && !isWinner ? "opacity-50" : ""}`}
    >
      <span
        className={`flag-circle h-6 w-6 shrink-0 ${team ? `fi fi-${team.code}` : "bg-edge"}`}
      />
      <span className={`min-w-0 flex-1 text-[12px] font-bold tracking-wide ${tone}`}>
        {team?.abbr ?? "—"}
      </span>
      {pen != null && (
        <span className="text-[9px] leading-none text-muted">({pen})</span>
      )}
      <span className={`w-3 text-center text-[13px] font-extrabold tabular-nums ${tone}`}>
        {score ?? ""}
      </span>
    </div>
  );
}

export function BracketMatch({ match: m, onOpen, side }: BracketMatchProps) {
  const ready = !!(m.homeId && m.awayId);
  const done = isFinished(m.status);

  // Placar exibido = tempo normal + prorrogação; pênaltis vão entre parênteses.
  const finalHome = m.homeGoals == null ? null : m.homeGoals + (m.homeET ?? 0);
  const finalAway = m.awayGoals == null ? null : m.awayGoals + (m.awayET ?? 0);
  const when = kickoff(m.id);

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => onOpen(m)}
      className={`w-full rounded-lg border px-2 py-1 transition-colors ${
        ready
          ? "border-edge bg-card/80 hover:bg-card-hover hover:border-accent/60 cursor-pointer"
          : "border-edge/40 bg-card/30 cursor-not-allowed"
      } ${done ? "ring-1 ring-win/40" : ""}`}
    >
      {when && (
        <div className="mb-0.5 text-center text-[8.5px] font-semibold uppercase tracking-wide text-muted">
          {when}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Side
          teamId={m.homeId}
          winnerId={m.winnerId}
          decided={done}
          align={side}
          score={finalHome}
          pen={m.homePen}
        />
        <Side
          teamId={m.awayId}
          winnerId={m.winnerId}
          decided={done}
          align={side}
          score={finalAway}
          pen={m.awayPen}
        />
      </div>
    </button>
  );
}
