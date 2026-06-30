"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Match } from "@/lib/types";
import { PHASE_LABEL } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { decide, type ResultInput } from "@/lib/engine";
import { Flag } from "./Flag";

interface ResultModalProps {
  match: Match;
  onClose: () => void;
  onSubmit: (matchId: string, input: ResultInput) => void;
}

function Stepper({
  value,
  onChange,
  accent,
}: {
  value: number;
  onChange: (v: number) => void;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-9 w-9 rounded-lg border border-edge bg-bg-soft text-lg font-bold text-muted hover:text-text hover:border-accent/60"
      >
        −
      </button>
      <span
        className={`w-9 text-center text-2xl font-extrabold tabular-nums ${
          accent ? "text-accent" : "text-text"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-lg border border-edge bg-bg-soft text-lg font-bold text-muted hover:text-text hover:border-accent/60"
      >
        +
      </button>
    </div>
  );
}

export function ResultModal({ match: m, onClose, onSubmit }: ResultModalProps) {
  const home = getTeam(m.homeId)!;
  const away = getTeam(m.awayId)!;

  const [hg, setHg] = useState(m.homeGoals ?? 0);
  const [ag, setAg] = useState(m.awayGoals ?? 0);
  const [het, setHet] = useState(m.homeET ?? 0);
  const [aet, setAet] = useState(m.awayET ?? 0);
  const [hp, setHp] = useState(m.homePen ?? 0);
  const [ap, setAp] = useState(m.awayPen ?? 0);

  const showET = hg === ag;
  const showPen = showET && hg + het === ag + aet;

  const decision = useMemo(
    () =>
      decide({
        homeId: m.homeId,
        awayId: m.awayId,
        homeGoals: hg,
        awayGoals: ag,
        homeET: showET ? het : null,
        awayET: showET ? aet : null,
        homePen: showPen ? hp : null,
        awayPen: showPen ? ap : null,
      }),
    [m.homeId, m.awayId, hg, ag, het, aet, hp, ap, showET, showPen],
  );

  const winner = getTeam(decision.winnerId);
  const canSave = decision.needs === null && !!decision.winnerId;

  function save() {
    if (!canSave) return;
    onSubmit(m.id, {
      homeGoals: hg,
      awayGoals: ag,
      homeET: showET ? het : null,
      awayET: showET ? aet : null,
      homePen: showPen ? hp : null,
      awayPen: showPen ? ap : null,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: 40, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-edge bg-card p-5 shadow-2xl"
      >
        <div className="mb-1 text-center text-[11px] uppercase tracking-widest text-accent">
          {PHASE_LABEL[m.phase]}
        </div>

        {/* Confronto */}
        <div className="mb-4 grid grid-cols-3 items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <Flag code={home.code} className="w-12 h-9" />
            <span className="text-center text-sm font-semibold leading-tight">
              {home.name}
            </span>
          </div>
          <span className="text-center text-xs font-bold text-muted">VS</span>
          <div className="flex flex-col items-center gap-1.5">
            <Flag code={away.code} className="w-12 h-9" />
            <span className="text-center text-sm font-semibold leading-tight">
              {away.name}
            </span>
          </div>
        </div>

        {/* Tempo normal */}
        <fieldset className="rounded-xl border border-edge bg-bg-soft/50 p-3">
          <legend className="px-2 text-[11px] uppercase tracking-wide text-muted">
            Tempo normal (90&apos;)
          </legend>
          <div className="flex items-center justify-center gap-6">
            <Stepper value={hg} onChange={setHg} />
            <span className="text-muted">×</span>
            <Stepper value={ag} onChange={setAg} />
          </div>
        </fieldset>

        <AnimatePresence>
          {showET && (
            <motion.fieldset
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden rounded-xl border border-gold/40 bg-gold/5 p-3"
            >
              <legend className="px-2 text-[11px] uppercase tracking-wide text-gold">
                Prorrogação (gols a somar)
              </legend>
              <div className="flex items-center justify-center gap-6">
                <Stepper value={het} onChange={setHet} accent />
                <span className="text-muted">×</span>
                <Stepper value={aet} onChange={setAet} accent />
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPen && (
            <motion.fieldset
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden rounded-xl border border-accent/40 bg-accent/5 p-3"
            >
              <legend className="px-2 text-[11px] uppercase tracking-wide text-accent">
                Pênaltis (não pode empatar)
              </legend>
              <div className="flex items-center justify-center gap-6">
                <Stepper value={hp} onChange={setHp} accent />
                <span className="text-muted">×</span>
                <Stepper value={ap} onChange={setAp} accent />
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>

        {/* Rodapé */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-edge px-3 py-2 text-sm text-muted hover:text-text"
          >
            Cancelar
          </button>
          <div className="flex-1 text-center text-xs">
            {winner ? (
              <span className="font-semibold text-win">🏆 {winner.name}</span>
            ) : (
              <span className="text-muted">
                {decision.needs === "ET"
                  ? "Empate → defina a prorrogação"
                  : decision.needs === "PEN"
                    ? "Empate → defina os pênaltis"
                    : "Defina o placar"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              canSave
                ? "bg-accent text-bg hover:brightness-110"
                : "cursor-not-allowed bg-edge text-muted"
            }`}
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
