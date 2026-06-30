import type { Team } from "./types";

// 48 seleções da Copa 2026 (códigos ISO para flag-icons; gb-eng/gb-sct/gb-wls suportados).
// "strength" é apenas um peso para a simulação automática — ajustável.
export const TEAMS: Team[] = [
  // CONMEBOL
  { id: "bra", name: "Brasil", abbr: "BRA", code: "br", strength: 92 },
  { id: "arg", name: "Argentina", abbr: "ARG", code: "ar", strength: 93 },
  { id: "uru", name: "Uruguai", abbr: "URU", code: "uy", strength: 84 },
  { id: "col", name: "Colômbia", abbr: "COL", code: "co", strength: 83 },
  { id: "ecu", name: "Equador", abbr: "EQU", code: "ec", strength: 76 },
  { id: "par", name: "Paraguai", abbr: "PAR", code: "py", strength: 70 },
  // UEFA
  { id: "fra", name: "França", abbr: "FRA", code: "fr", strength: 94 },
  { id: "eng", name: "Inglaterra", abbr: "ING", code: "gb-eng", strength: 90 },
  { id: "esp", name: "Espanha", abbr: "ESP", code: "es", strength: 91 },
  { id: "ger", name: "Alemanha", abbr: "ALE", code: "de", strength: 88 },
  { id: "por", name: "Portugal", abbr: "POR", code: "pt", strength: 89 },
  { id: "ned", name: "Holanda", abbr: "HOL", code: "nl", strength: 87 },
  { id: "bel", name: "Bélgica", abbr: "BEL", code: "be", strength: 85 },
  { id: "ita", name: "Itália", abbr: "ITA", code: "it", strength: 86 },
  { id: "cro", name: "Croácia", abbr: "CRO", code: "hr", strength: 82 },
  { id: "swe", name: "Suécia", abbr: "SUE", code: "se", strength: 78 },
  { id: "bih", name: "Bósnia e Herzegovina", abbr: "BOS", code: "ba", strength: 72 },
  { id: "den", name: "Dinamarca", abbr: "DIN", code: "dk", strength: 80 },
  { id: "sui", name: "Suíça", abbr: "SUI", code: "ch", strength: 78 },
  { id: "srb", name: "Sérvia", abbr: "SER", code: "rs", strength: 75 },
  { id: "pol", name: "Polônia", abbr: "POL", code: "pl", strength: 74 },
  { id: "aut", name: "Áustria", abbr: "AUT", code: "at", strength: 76 },
  { id: "ukr", name: "Ucrânia", abbr: "UCR", code: "ua", strength: 73 },
  { id: "sco", name: "Escócia", abbr: "ESC", code: "gb-sct", strength: 71 },
  { id: "tur", name: "Turquia", abbr: "TUR", code: "tr", strength: 75 },
  { id: "nor", name: "Noruega", abbr: "NOR", code: "no", strength: 77 },
  // CONCACAF
  { id: "usa", name: "Estados Unidos", abbr: "EUA", code: "us", strength: 79 },
  { id: "mex", name: "México", abbr: "MEX", code: "mx", strength: 80 },
  { id: "can", name: "Canadá", abbr: "CAN", code: "ca", strength: 75 },
  { id: "crc", name: "Costa Rica", abbr: "CRC", code: "cr", strength: 68 },
  { id: "pan", name: "Panamá", abbr: "PAN", code: "pa", strength: 66 },
  { id: "jam", name: "Jamaica", abbr: "JAM", code: "jm", strength: 64 },
  // CAF
  { id: "mar", name: "Marrocos", abbr: "MAR", code: "ma", strength: 83 },
  { id: "sen", name: "Senegal", abbr: "SEN", code: "sn", strength: 81 },
  { id: "nga", name: "Nigéria", abbr: "NGA", code: "ng", strength: 78 },
  { id: "egy", name: "Egito", abbr: "EGI", code: "eg", strength: 76 },
  { id: "alg", name: "Argélia", abbr: "ALG", code: "dz", strength: 75 },
  { id: "tun", name: "Tunísia", abbr: "TUN", code: "tn", strength: 70 },
  { id: "cmr", name: "Camarões", abbr: "CAM", code: "cm", strength: 73 },
  { id: "gha", name: "Gana", abbr: "GAN", code: "gh", strength: 72 },
  { id: "civ", name: "Costa do Marfim", abbr: "CIV", code: "ci", strength: 74 },
  { id: "rsa", name: "África do Sul", abbr: "AFS", code: "za", strength: 69 },
  { id: "cod", name: "RD Congo", abbr: "RDC", code: "cd", strength: 70 },
  { id: "cpv", name: "Cabo Verde", abbr: "CPV", code: "cv", strength: 64 },
  // AFC
  { id: "jpn", name: "Japão", abbr: "JAP", code: "jp", strength: 80 },
  { id: "kor", name: "Coreia do Sul", abbr: "COR", code: "kr", strength: 78 },
  { id: "irn", name: "Irã", abbr: "IRA", code: "ir", strength: 76 },
  { id: "aus", name: "Austrália", abbr: "AUS", code: "au", strength: 74 },
  { id: "ksa", name: "Arábia Saudita", abbr: "ARA", code: "sa", strength: 69 },
  { id: "qat", name: "Catar", abbr: "CAT", code: "qa", strength: 68 },
  { id: "irq", name: "Iraque", abbr: "IRQ", code: "iq", strength: 65 },
  { id: "uzb", name: "Uzbequistão", abbr: "UZB", code: "uz", strength: 67 },
  // OFC
  { id: "nzl", name: "Nova Zelândia", abbr: "NZL", code: "nz", strength: 63 },
];

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

export function getTeam(id: string | null): Team | null {
  return id ? TEAMS_BY_ID[id] ?? null : null;
}
