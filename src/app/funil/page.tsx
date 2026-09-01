"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Lead, LeadStatus, LEAD_STATUS_LABELS } from "@/lib/types";
import FunnelColumn from "@/components/FunnelColumn";

const STATUSES: LeadStatus[] = [
  "novo",
  "em_contato",
  "simulacao_enviada",
  "proposta_enviada",
  "fechado",
  "perdido",
];

export default function FunnelPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarLeads = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarLeads();
  }, [carregarLeads]);

  // Agrupa os leads por status
  const leadsPorStatus: Record<LeadStatus, Lead[]> = {
    novo: [],
    em_contato: [],
    simulacao_enviada: [],
    proposta_enviada: [],
    fechado: [],
    perdido: [],
  };

  leads.forEach((lead) => {
    leadsPorStatus[lead.status].push(lead);
  });

  // Estatísticas gerais
  const totalLeads = leads.length;
  const totalCredito = leads.reduce(
    (sum, lead) => sum + (lead.valor_credito_desejado || 0),
    0
  );
  const leadsFechados = leads.filter((l) => l.status === "fechado").length;
  const taxaConversao =
    totalLeads > 0 ? ((leadsFechados / totalLeads) * 100).toFixed(1) : "0";

  if (carregando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-slate-400">Carregando funil...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 min-h-screen pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Funil de Vendas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize o progresso dos seus leads através do pipeline de vendas.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Total de Leads</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalLeads}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Volume Total</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              R$ {(totalCredito / 1_000_000).toFixed(1)}M
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Fechados</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {leadsFechados}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Taxa de Conversão</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {taxaConversao}%
            </div>
          </div>
        </div>
      </div>

      {/* Funil Kanban */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-6">
          {STATUSES.map((status) => (
            <div key={status} className="flex-1 min-w-sm">
              <FunnelColumn
                status={status}
                statusLabel={LEAD_STATUS_LABELS[status]}
                leads={leadsPorStatus[status]}
                onStatusChanged={carregarLeads}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
