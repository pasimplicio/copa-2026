import { TEAMS } from "./teams";

// Normaliza um nome de seleção para comparação (minúsculas, sem acentos/pontuação).
export function norm(s: string): string {
  // NFD separa o acento da letra base; [^a-z] remove acentos, espaços e pontuação.
  return s.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
}

// Apelidos/grafias em inglês usados por APIs (api-football) → id interno.
// A chave é o nome JÁ normalizado por norm().
const ALIASES: Record<string, string> = {
  // CONMEBOL
  brazil: "bra",
  argentina: "arg",
  uruguay: "uru",
  colombia: "col",
  ecuador: "ecu",
  paraguay: "par",
  // UEFA
  france: "fra",
  england: "eng",
  spain: "esp",
  germany: "ger",
  portugal: "por",
  netherlands: "ned",
  holland: "ned",
  belgium: "bel",
  italy: "ita",
  croatia: "cro",
  sweden: "swe",
  bosniaandherzegovina: "bih",
  bosnia: "bih",
  denmark: "den",
  switzerland: "sui",
  serbia: "srb",
  poland: "pol",
  austria: "aut",
  ukraine: "ukr",
  scotland: "sco",
  turkey: "tur",
  turkiye: "tur",
  norway: "nor",
  // CONCACAF
  unitedstates: "usa",
  usa: "usa",
  usmnt: "usa",
  mexico: "mex",
  canada: "can",
  costarica: "crc",
  panama: "pan",
  jamaica: "jam",
  // CAF
  morocco: "mar",
  senegal: "sen",
  nigeria: "nga",
  egypt: "egy",
  algeria: "alg",
  tunisia: "tun",
  cameroon: "cmr",
  ghana: "gha",
  ivorycoast: "civ",
  cotedivoire: "civ",
  southafrica: "rsa",
  drcongo: "cod",
  congodr: "cod",
  democraticrepublicofcongo: "cod",
  capeverde: "cpv",
  capeverdeislands: "cpv",
  // AFC
  japan: "jpn",
  southkorea: "kor",
  korearepublic: "kor",
  iran: "irn",
  iranislamicrepublic: "irn",
  australia: "aus",
  saudiarabia: "ksa",
  qatar: "qat",
  iraq: "irq",
  uzbekistan: "uzb",
  // OFC
  newzealand: "nzl",
};

// Lookup combinando os nomes em PT do dataset com os apelidos em inglês.
const LOOKUP: Record<string, string> = (() => {
  const map: Record<string, string> = { ...ALIASES };
  for (const t of TEAMS) map[norm(t.name)] = t.id; // grafia PT do próprio dataset
  return map;
})();

// Retorna o id interno da seleção a partir de um nome vindo da API (ou null).
export function idFromApiName(name: string | null | undefined): string | null {
  if (!name) return null;
  return LOOKUP[norm(name)] ?? null;
}
