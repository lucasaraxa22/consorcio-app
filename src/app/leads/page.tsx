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
    let ignore = false;
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!ignore) {
          if (!error && data) {
            setLeads(data as Lead[]);
          }
          setCarregando(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#16233B] via-[#1a2d4d] to-[#24395d] p-6 text-white shadow-[0_18px_40px_rgba(22,35,59,0.22)] mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">Leads e Clientes</h1>
          </div>
          <p className="text-sm text-slate-200 max-w-md">
            Cadastre novos contatos e acompanhe em que etapa cada um está.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1.6fr] gap-6">
        <LeadForm onCreated={carregarLeads} />

        <div className="space-y-4">
          <div className="bg-white/70 rounded-2xl border border-slate-200 px-4 py-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Lista de leads</h2>
              <span className="text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-1">
                {leads.length} registros
              </span>
            </div>
          </div>

          {carregando ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              Carregando leads...
            </div>
          ) : (
            <LeadList leads={leads} onChanged={carregarLeads} />
          )}
        </div>
      </div>
    </div>
  );
}
