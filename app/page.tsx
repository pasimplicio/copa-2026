"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Match } from "@/lib/types";
import { useBracket } from "@/lib/store";
import { Toolbar } from "@/components/Toolbar";
import { BracketTree } from "@/components/BracketTree";
import { ResultModal } from "@/components/ResultModal";
import { ChampionScreen } from "@/components/ChampionScreen";

export default function Home() {
  const matches = useBracket((s) => s.matches);
  const submitResult = useBracket((s) => s.submitResult);
  const loadRealResults = useBracket((s) => s.loadRealResults);
  const applyExternal = useBracket((s) => s.applyExternal);
  const reset = useBracket((s) => s.reset);

  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showChampion, setShowChampion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Busca os resultados ao vivo na rota /api/results (fonte: openfootball) e
  // preenche o chaveamento. Se a fonte falhar, aplica o snapshot local.
  async function handleFetch() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/results", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        const n = applyExternal(data.results);
        setStatus(`✓ ${n} confronto(s) atualizado(s) com os resultados reais`);
      } else {
        loadRealResults();
        setStatus("Fonte sem jogos no momento — apliquei o snapshot local.");
      }
    } catch {
      loadRealResults();
      setStatus("Falha ao buscar — apliquei o snapshot local.");
    } finally {
      setLoading(false);
    }
  }

  const final = matches.find((m) => m.phase === "F");
  const championId = final?.winnerId ?? null;
  const decided = matches.filter((m) => m.winnerId).length;

  useEffect(() => {
    if (championId) setShowChampion(true);
  }, [championId]);

  if (!mounted) {
    return (
      <main className="flex flex-1 items-center justify-center text-muted">
        Carregando chaveamento…
      </main>
    );
  }

  const selected = selectedId
    ? matches.find((m) => m.id === selectedId) ?? null
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <Toolbar
        decided={decided}
        total={matches.length}
        loading={loading}
        status={status}
        onFetch={handleFetch}
        onReset={() => {
          reset();
          setShowChampion(false);
          setStatus(null);
        }}
      />

      <BracketTree matches={matches} onOpen={(m: Match) => setSelectedId(m.id)} />

      {championId && !showChampion && (
        <button
          type="button"
          onClick={() => setShowChampion(true)}
          className="fixed bottom-4 right-4 z-30 rounded-full bg-gold px-4 py-3 text-sm font-bold text-bg shadow-lg hover:brightness-110"
        >
          🏆 Ver campeão
        </button>
      )}

      <AnimatePresence>
        {selected && (
          <ResultModal
            match={selected}
            onClose={() => setSelectedId(null)}
            onSubmit={submitResult}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChampion && championId && (
          <ChampionScreen
            championId={championId}
            matches={matches}
            onClose={() => setShowChampion(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
