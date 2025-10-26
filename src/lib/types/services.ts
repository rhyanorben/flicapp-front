/**
 * Service types and experience levels for provider requests
 */

export const SERVICE_TYPES = [
  "eletricista",
  "encanador",
  "limpeza-residencial",
  "suporte-de-informatica",
  "montador-de-moveis",
  "chaveiro",
  "pintor",
  "pedreiro-reforma",
  "marceneiro",
  "jardinagem",
  "piscineiro",
  "dedetizacao",
  "gesseiro",
  "serralheiro",
  "vidraceiro",
  "instalador-ar-condicionado",
  "manutencao-eletrodomesticos",
  "mecanico-automotivo",
  "funilaria-automotiva",
  "transporte-frete",
  "mudanca-carretos",
  "cuidador-idosos",
  "baba",
  "professor-particular",
  "personal-trainer",
  "fotografo-filmagem",
  "designer-grafico",
  "cabeleireiro",
  "manicure-pedicure",
  "maquiagem",
  "buffet",
  "dj-som",
  "decoracao-eventos",
  "outros",
] as const;

export const EXPERIENCE_LEVELS = [
  "iniciante", // 0-1 anos
  "intermediario", // 1-3 anos
  "avancado", // 3-5 anos
  "especialista", // 5+ anos
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export interface ServiceSelection {
  serviceType: ServiceType;
  experienceLevel: ExperienceLevel;
  customService?: string; // Para quando serviceType é "outros"
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  eletricista: "Eletricista",
  encanador: "Encanador",
  "limpeza-residencial": "Limpeza Residencial",
  "suporte-de-informatica": "Suporte de Informática",
  "montador-de-moveis": "Montador de Móveis",
  chaveiro: "Chaveiro",
  pintor: "Pintor",
  "pedreiro-reforma": "Pedreiro/Reforma",
  marceneiro: "Marceneiro",
  jardinagem: "Jardinagem",
  piscineiro: "Piscineiro",
  dedetizacao: "Dedetização",
  gesseiro: "Gesseiro",
  serralheiro: "Serralheiro",
  vidraceiro: "Vidraceiro",
  "instalador-ar-condicionado": "Instalador de Ar Condicionado",
  "manutencao-eletrodomesticos": "Manutenção de Eletrodomésticos",
  "mecanico-automotivo": "Mecânico Automotivo",
  "funilaria-automotiva": "Funilaria Automotiva",
  "transporte-frete": "Transporte/Frete",
  "mudanca-carretos": "Mudança/Carretos",
  "cuidador-idosos": "Cuidador de Idosos",
  baba: "Babá",
  "professor-particular": "Professor Particular",
  "personal-trainer": "Personal Trainer",
  "fotografo-filmagem": "Fotógrafo/Filmagem",
  "designer-grafico": "Designer Gráfico",
  cabeleireiro: "Cabeleireiro",
  "manicure-pedicure": "Manicure/Pedicure",
  maquiagem: "Maquiagem",
  buffet: "Buffet",
  "dj-som": "DJ/Som",
  "decoracao-eventos": "Decoração de Eventos",
  outros: "Outros",
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  iniciante: "Iniciante (0-1 anos)",
  intermediario: "Intermediário (1-3 anos)",
  avancado: "Avançado (3-5 anos)",
  especialista: "Especialista (5+ anos)",
};
