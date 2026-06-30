"use client";

import { Fragment, useState } from "react";
import type { Match, Phase } from "@/lib/types";
import { PHASE_SHORT } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { BracketMatch } from "./BracketMatch";

interface BracketTreeProps {
  matches: Match[];
  onOpen: (m: Match) => void;
}

// Ordena as partidas de uma fase seguindo a ordem das partidas "pai" (a fase
// interna), expandindo cada pai em seus dois alimentadores (home, depois away).
function feedersOf(matches: Match[], parents: Match[]): Match[] {
  const out: Match[] = [];
  for (const parent of parents) {
    const fs = matches
      .filter((m) => m.feedsTo === parent.id)
      .sort((a, b) => (a.feedSlot === "home" ? -1 : 1));
    out.push(...fs);
  }
  return out;
}

// Constrói as colunas de um lado, da semifinal (interna) para os 16-avos (externa).
function buildSide(matches: Match[], sf: Match): Match[][] {
  const cols: Match[][] = [[sf]];
  let current = [sf];
  for (;;) {
    const feeders = feedersOf(matches, current);
    if (feeders.length === 0) break;
    cols.push(feeders);
    current = feeders;
  }
  return cols; // [SF(1), QF(2), R16(4), R32(8)]
}

function ConnColumn({
  count,
  side,
}: {
  count: number;
  side: "left" | "right";
}) {
  return (
    <div className="conn">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`cc cc-${side}`}>
          <span className="h top" />
          <span className="h bot" />
          <span className="v" />
          <span className="h out" />
        </div>
      ))}
    </div>
  );
}

function Column({
  phase,
  matches,
  onOpen,
  side,
  showLabel,
}: {
  phase: Phase;
  matches: Match[];
  onOpen: (m: Match) => void;
  side: "left" | "right";
  showLabel: boolean;
}) {
  return (
    <div className="col">
      {showLabel && <span className="col-label">{PHASE_SHORT[phase]}</span>}
      {matches.map((m) => (
        <div className="cell" key={m.id}>
          <BracketMatch match={m} onOpen={onOpen} side={side} />
        </div>
      ))}
    </div>
  );
}

export function BracketTree({ matches, onOpen }: BracketTreeProps) {
  const final = matches.find((m) => m.phase === "F");
  if (!final) return null;

  const sfLeft = matches.find(
    (m) => m.feedsTo === final.id && m.feedSlot === "home",
  )!;
  const sfRight = matches.find(
    (m) => m.feedsTo === final.id && m.feedSlot === "away",
  )!;

  // Colunas internas→externas; para renderizar da esquerda invertendo.
  const left = buildSide(matches, sfLeft); // [SF, QF, R16, R32]
  const right = buildSide(matches, sfRight);
  const leftOuter = [...left].reverse(); // [R32, R16, QF, SF]
  const champ = getTeam(final.winnerId);

  const [zoom, setZoom] = useState(1);
  const setZ = (v: number) =>
    setZoom(Math.min(1.6, Math.max(0.5, Math.round(v * 100) / 100)));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="bracket-scroll tree flex-1 overflow-auto px-4 pb-6 pt-10">
        <div
          className="mx-auto flex h-[760px] w-max items-stretch"
          style={{ zoom }}
        >
        {/* LADO ESQUERDO: 16-avos → ... → semifinal (linhas apontam à direita) */}
        {leftOuter.map((col, i) => (
          <Fragment key={`L-${col[0].phase}`}>
            <Column
              phase={col[0].phase}
              matches={col}
              onOpen={onOpen}
              side="left"
              showLabel
            />
            {i < leftOuter.length - 1 && (
              <ConnColumn count={leftOuter[i + 1].length} side="left" />
            )}
          </Fragment>
        ))}

        {/* CENTRO: semifinal esquerda → FINAL → semifinal direita */}
        <div className="conn">
          <div className="cc cc-mid">
            <span className="line" />
          </div>
        </div>
        <div className="col justify-center" style={{ width: 140 }}>
          <div className="cell">
            <div className="w-full rounded-xl border-2 border-gold/70 bg-gold/10 p-2">
              <div className="mb-1 text-center text-xs font-black uppercase tracking-widest text-gold">
                🏆 Final
              </div>
              <BracketMatch match={final} onOpen={onOpen} side="left" />
              {champ && (
                <div className="mt-1.5 text-center text-[11px] font-bold text-gold">
                  {champ.name}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="conn">
          <div className="cc cc-mid">
            <span className="line" />
          </div>
        </div>

        {/* LADO DIREITO: semifinal → ... → 16-avos (linhas apontam à esquerda) */}
        {right.map((col, i) => (
          <Fragment key={`R-${col[0].phase}`}>
            {i > 0 && <ConnColumn count={right[i - 1].length} side="right" />}
            <Column
              phase={col[0].phase}
              matches={col}
              onOpen={onOpen}
              side="right"
              showLabel
            />
          </Fragment>
        ))}
        </div>
      </div>

      {/* Controle de zoom do chaveamento */}
      <div className="fixed bottom-4 left-4 z-30 flex items-center gap-1 rounded-full border border-edge bg-card/90 px-1.5 py-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setZ(zoom - 0.1)}
          aria-label="Diminuir zoom"
          className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold text-muted hover:bg-card-hover hover:text-text"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setZ(1)}
          className="min-w-[3rem] rounded-full px-2 text-xs font-bold tabular-nums text-text hover:bg-card-hover"
          title="Redefinir zoom (100%)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setZ(zoom + 0.1)}
          aria-label="Aumentar zoom"
          className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold text-muted hover:bg-card-hover hover:text-text"
        >
          +
        </button>
      </div>
    </div>
  );
}
