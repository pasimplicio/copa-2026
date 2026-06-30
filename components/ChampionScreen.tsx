"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { Match } from "@/lib/types";
import { PHASE_SHORT } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { Flag } from "./Flag";

interface ChampionScreenProps {
  championId: string;
  matches: Match[];
  onClose: () => void;
}

export function ChampionScreen({ championId, matches, onClose }: ChampionScreenProps) {
  const champ = getTeam(championId)!;
  // Caminho do campeão: partidas que ele venceu, da primeira fase à final.
  const order = ["R32", "R16", "QF", "SF", "F"];
  const path = matches
    .filter((m) => m.winnerId === championId)
    .sort((a, b) => order.indexOf(a.phase) - order.indexOf(b.phase));

  useEffect(() => {
    const end = Date.now() + 1200;
    const colors = ["#fbbf24", "#22d3ee", "#34d399", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-bg/95 p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="text-6xl">🏆</div>
        <span className="text-sm uppercase tracking-[0.3em] text-gold">Campeã do Mundo</span>
        <Flag code={champ.code} className="w-32 h-24 shadow-2xl" />
        <h2 className="text-4xl font-black text-text">{champ.name}</h2>
      </motion.div>

      <div className="w-full max-w-md">
        <p className="mb-2 text-xs uppercase tracking-wide text-muted">
          Caminho do campeão · {path.length} jogos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {path.map((m, i) => {
            const rivalId = m.winnerId === m.homeId ? m.awayId : m.homeId;
            const rival = getTeam(rivalId);
            return (
              <div
                key={m.id}
                className="flex items-center gap-1.5 rounded-lg border border-edge bg-card px-2 py-1.5"
              >
                <span className="text-[9px] uppercase text-muted">
                  {PHASE_SHORT[m.phase]}
                </span>
                <Flag code={rival?.code} className="w-5 h-[14px]" />
                {i < path.length - 1 && <span className="text-muted">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl bg-accent px-6 py-3 font-bold text-bg hover:brightness-110"
      >
        Ver chaveamento
      </button>
    </motion.div>
  );
}
