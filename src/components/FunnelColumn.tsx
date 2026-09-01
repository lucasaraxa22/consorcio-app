"use client";

import { Lead, LeadStatus, LEAD_STATUS_COLORS } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

interface FunnelColumnProps {
  status: LeadStatus;
  statusLabel: string;
  leads: Lead[];
  onStatusChanged: () => void;
}

export default function FunnelColumn({
  status,
  statusLabel,
  leads,
  onStatusChanged,
}: FunnelColumnProps) {
  async function mudarStatus(leadId: string, novoStatus: LeadStatus) {
    await supabase.from("leads").update({ status: novoStatus }).eq("id", leadId);
    onStatusChanged();
  }

  const count = leads.length;
  const totalCredito = leads.reduce(
    (sum, lead) => sum + (lead.valor_credito_desejado || 0),
    0
  );

  return (
    <div className="flex flex-col flex-1 min-w-xs bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-4 h-full">
      {/* Header da coluna */}
      <div className="mb-4 pb-3 border-b border-slate-300">
        <h3 className="font-semibold text-slate-900 text-sm">{statusLabel}</h3>
        <div className="flex justify-between items-center mt-1 text-xs text-slate-600">
          <span>{count} lead{count !== 1 ? "s" : ""}</span>
          {totalCredito > 0 && (
            <span className="font-medium text-slate-700">
              R$ {(totalCredito / 1000).toFixed(0)}k
            </span>
          )}
        </div>
      </div>

      {/* Cards dos leads */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-8">
            Nenhum lead
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg border border-slate-300 p-3 shadow-sm hover:shadow-md transition"
            >
              {/* Nome do lead */}
              <h4 className="font-medium text-slate-900 text-sm truncate">
                {lead.nome}
              </h4>

              {/* Detalhes */}
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                {lead.telefone && (
                  <p className="truncate">📱 {lead.telefone}</p>
                )}
                {lead.email && <p className="truncate">✉️ {lead.email}</p>}
                {lead.interesse && (
                  <p className="truncate capitalize">
                    🎯 {lead.interesse}
                  </p>
                )}
                {lead.valor_credito_desejado && (
                  <p className="font-medium text-slate-700">
                    💰{" "}
                    {Number(lead.valor_credito_desejado).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </p>
                )}
              </div>

              {/* Menu de ações */}
              <div className="mt-3 flex gap-1">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    mudarStatus(lead.id, e.target.value as LeadStatus)
                  }
                  className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 cursor-pointer hover:border-slate-400 flex-1"
                >
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em contato</option>
                  <option value="simulacao_enviada">Simulação</option>
                  <option value="proposta_enviada">Proposta</option>
                  <option value="fechado">Fechado</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
