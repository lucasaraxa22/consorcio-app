"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Lead } from "@/lib/types";
import LeadForm from "@/components/LeadForm";
import LeadList from "@/components/LeadList";

export default function LeadsPage() {
  useRequireAuth();

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads e Clientes</h1>
        <p className="text-slate-500 text-sm mt-1">
          Cadastre novos contatos e acompanhe em que etapa cada um está.
        </p>
      </div>

      <LeadForm onCreated={carregarLeads} />

      {carregando ? (
        <p className="text-sm text-slate-400">Carregando leads...</p>
      ) : (
        <LeadList leads={leads} onChanged={carregarLeads} />
      )}
    </div>
  );
}
