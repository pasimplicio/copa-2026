# 🏆 Copa 2026 — Mata-Mata

Simulador interativo do **mata-mata da Copa do Mundo 2026** (48 seleções, fase inédita de 16-avos, 31 jogos eliminatórios). Chaveamento em espelho no estilo clássico, com bandeiras, placares, datas e coroação do campeão. App **Next.js** instalável como PWA.

## ✨ Recursos

- **Chaveamento oficial 2026** — confrontos reais das 16-avos e a árvore correta até a final (Brasil ✕ vencedor de Costa do Marfim/Noruega, etc.).
- **Lançamento manual de resultados** — clique numa partida e informe o placar; o fluxo trata empate → **prorrogação** → **pênaltis** e o vencedor avança automaticamente.
- **Atualizar resultados reais** — busca os placares já disputados na fonte pública **openfootball** (sem chave) e preenche o chaveamento, propagando os vencedores.
- **Data/hora de cada jogo** em horário de Brasília (ex.: `30/06 14:00`).
- **Zoom** do chaveamento, **persistência offline** (localStorage) e **coroação** animada do campeão com confete.

## 🧱 Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand (persist) · Framer Motion · flag-icons · canvas-confetti.

## 🚀 Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

Verificações:

```bash
npx tsc --noEmit            # checagem de tipos
npx tsx scripts/check.ts    # testes das invariantes (31 jogos, empate, caminho do campeão)
```

## 🔄 Fonte de resultados

O botão **Atualizar resultados** chama a rota server-side `app/api/results`, que lê o `worldcup.json` 2026 da [openfootball](https://github.com/openfootball/worldcup.json) (domínio público, **sem chave**) e normaliza cada jogo (90' + prorrogação + pênaltis). Se a fonte falhar, aplica um snapshot local. A URL pode ser trocada por `WC_SOURCE_URL` (ver `.env.example`). Como há uma rota de servidor, o deploy precisa de runtime Node (ex.: Vercel).

## 🗂️ Estrutura

- `lib/` — domínio puro: `types`, `teams` (48 seleções), `bracket` (31 jogos + cruzamentos oficiais), `engine` (regra de empate), `store` (Zustand), `openfootball`/`teamAliases` (parsing da fonte), `schedule` (datas).
- `components/` — `BracketTree`/`BracketMatch` (chaveamento em espelho), `ResultModal`, `ChampionScreen`, `Toolbar`.
- `app/` — página, layout/PWA e a rota `api/results`.

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code).
