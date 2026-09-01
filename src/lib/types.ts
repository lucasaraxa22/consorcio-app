// Este arquivo descreve os "campos" que um Lead tem.
// Sempre que você adicionar uma coluna nova na tabela do banco,
// adicione o campo aqui também, para o TypeScript te ajudar a não errar.

export type LeadStatus =
  | "novo"
  | "em_contato"
  | "simulacao_enviada"
  | "proposta_enviada"
  | "fechado"
  | "perdido";

export interface Lead {
  id: string;
  created_at: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  interesse: string | null; // ex: "imóvel", "veículo", "pesado"
  valor_credito_desejado: number | null;
  status: LeadStatus;
  observacoes: string | null;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  simulacao_enviada: "Simulação enviada",
  proposta_enviada: "Proposta enviada",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-slate-200 text-slate-700",
  em_contato: "bg-sky-100 text-sky-700",
  simulacao_enviada: "bg-amber-100 text-amber-800",
  proposta_enviada: "bg-violet-100 text-violet-700",
  fechado: "bg-emerald-100 text-emerald-700",
  perdido: "bg-rose-100 text-rose-700",
};

// --- Simulador de Consórcio ---

export interface Simulacao {
  id: string;
  created_at: string;
  lead_id: string | null;
  valor_credito: number;
  prazo_meses: number;
  taxa_admin: number;
  fundo_reserva: number;
  percentual_lance: number;
  parcela_sem_lance: number;
  parcela_com_lance: number | null;
  observacoes: string | null;
}
