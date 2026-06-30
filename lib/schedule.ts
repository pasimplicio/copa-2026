// Data/hora oficial de cada partida do mata-mata (instante em UTC).
// Gerado a partir do agendamento da openfootball (Copa 2026). O agendamento é
// fixo, por isso fica embutido. Exibido convertido para horário de Brasília.
export const SCHEDULE: Record<string, string> = {
  "R32-0": "2026-06-28T19:00:00.000Z",
  "R32-1": "2026-06-29T20:30:00.000Z",
  "R32-2": "2026-06-30T01:00:00.000Z",
  "R32-3": "2026-06-29T17:00:00.000Z",
  "R32-4": "2026-06-30T21:00:00.000Z",
  "R32-5": "2026-06-30T17:00:00.000Z",
  "R32-6": "2026-07-01T01:00:00.000Z",
  "R32-7": "2026-07-01T16:00:00.000Z",
  "R32-8": "2026-07-02T00:00:00.000Z",
  "R32-9": "2026-07-01T20:00:00.000Z",
  "R32-10": "2026-07-02T23:00:00.000Z",
  "R32-11": "2026-07-02T19:00:00.000Z",
  "R32-12": "2026-07-03T03:00:00.000Z",
  "R32-13": "2026-07-03T22:00:00.000Z",
  "R32-14": "2026-07-04T01:30:00.000Z",
  "R32-15": "2026-07-03T18:00:00.000Z",
  "R16-0": "2026-07-04T21:00:00.000Z",
  "R16-1": "2026-07-04T17:00:00.000Z",
  "R16-2": "2026-07-05T20:00:00.000Z",
  "R16-3": "2026-07-06T00:00:00.000Z",
  "R16-4": "2026-07-07T00:00:00.000Z",
  "R16-5": "2026-07-06T19:00:00.000Z",
  "R16-6": "2026-07-07T16:00:00.000Z",
  "R16-7": "2026-07-07T20:00:00.000Z",
  "QF-0": "2026-07-09T20:00:00.000Z",
  "QF-1": "2026-07-11T21:00:00.000Z",
  "QF-2": "2026-07-10T19:00:00.000Z",
  "QF-3": "2026-07-12T01:00:00.000Z",
  "SF-0": "2026-07-14T19:00:00.000Z",
  "SF-1": "2026-07-15T19:00:00.000Z",
  "F-0": "2026-07-19T19:00:00.000Z",
};

const dtf = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Retorna "DD/MM HH:MM" (horário de Brasília) ou null se não houver agenda.
export function kickoff(matchId: string): string | null {
  const iso = SCHEDULE[matchId];
  if (!iso) return null;
  const p = Object.fromEntries(
    dtf.formatToParts(new Date(iso)).map((x) => [x.type, x.value]),
  );
  return `${p.day}/${p.month} ${p.hour}:${p.minute}`;
}
