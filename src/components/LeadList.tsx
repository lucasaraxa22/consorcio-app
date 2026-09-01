"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  Lead,
  LeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
} from "@/lib/types";

interface LeadListProps {
  leads: Lead[];
  onChanged: () => void;
}

const STATUS_OPTIONS = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

export default function LeadList({ leads, onChanged }: LeadListProps) {
  async function atualizarStatus(id: string, status: LeadStatus) {
    await supabase.from("leads").update({ status }).eq("id", id);
    onChanged();
  }

  async function excluir(id: string) {
    const confirmado = window.confirm("Excluir este lead?");
    if (!confirmado) return;
    await supabase.from("leads").delete().eq("id", id);
    onChanged();
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm shadow-sm">
        Nenhum lead cadastrado ainda. Use o formulário acima para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 truncate">
                {lead.nome}
              </h3>
              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${LEAD_STATUS_COLORS[lead.status]}`}
              >
                {LEAD_STATUS_LABELS[lead.status]}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1.5">
              {[lead.telefone, lead.email, lead.interesse]
                .filter(Boolean)
                .join(" · ") || "Sem dados de contato"}
            </p>
            {lead.valor_credito_desejado && (
              <p className="text-sm text-slate-600 mt-1">
                Crédito desejado:{" "}
                <span className="font-medium text-slate-800">
                  {Number(lead.valor_credito_desejado).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={lead.status}
              onChange={(e) =>
                atualizarStatus(lead.id, e.target.value as LeadStatus)
              }
              className="text-sm border border-slate-300 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              onClick={() => excluir(lead.id)}
              className="text-sm text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition"
              title="Excluir lead"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
