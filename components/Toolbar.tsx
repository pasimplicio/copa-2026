"use client";

interface ToolbarProps {
  decided: number;
  total: number;
  loading: boolean;
  status: string | null;
  onFetch: () => void;
  onReset: () => void;
}

export function Toolbar({
  decided,
  total,
  loading,
  status,
  onFetch,
  onReset,
}: ToolbarProps) {
  const pct = Math.round((decided / total) * 100);
  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-bg/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <h1 className="text-base font-extrabold leading-none">
              Copa 2026 — Mata-Mata
            </h1>
            <p className="text-[11px] text-muted">
              48 seleções · 16-avos de final · 31 jogos
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] text-muted">
              {decided}/{total} decididos
            </span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-edge">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onFetch}
            disabled={loading}
            title="Busca os resultados reais (openfootball) e preenche o chaveamento"
            className={`rounded-lg px-3 py-2 text-sm font-bold text-bg transition ${
              loading
                ? "cursor-wait bg-accent/60"
                : "bg-accent hover:brightness-110"
            }`}
          >
            {loading ? "⟳ Buscando…" : "⟳ Atualizar resultados"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-edge px-3 py-2 text-sm text-muted hover:text-text"
          >
            ↺ Resetar
          </button>
        </div>
      </div>

      <div className="relative border-t border-edge/60 bg-bg-soft/50 px-4 py-1.5 text-center text-[11px] text-muted">
        <div>
          {status ?? (
            <span>
              <span className="text-accent">👆</span> Selecione a partida para
              simular
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-muted/80 sm:mt-0 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2">
          Desenvolvido por{" "}
          <span className="font-semibold text-text/80">Paulo Simplicio</span>
        </div>
      </div>
    </header>
  );
}
