"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { calcularSimulacao, formatarMoeda } from "@/lib/simulador";
import { Lead } from "@/lib/types";

export default function SimuladorForm() {
  const [valorCredito, setValorCredito] = useState("100000");
  const [prazoMeses, setPrazoMeses] = useState("180");
  const [taxaAdmin, setTaxaAdmin] = useState("18");
  const [fundoReserva, setFundoReserva] = useState("2");
  const [percentualLance, setPercentualLance] = useState("0");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSelecionado, setLeadSelecionado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Carrega a lista de leads só para preencher o seletor "vincular a um cliente"
  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("nome", { ascending: true })
      .then(({ data }) => {
        if (data) setLeads(data as Lead[]);
      });
  }, []);

  // Recalcula automaticamente sempre que um campo muda — sem precisar de botão "calcular"
  const resultado = useMemo(() => {
    const credito = Number(valorCredito) || 0;
    const prazo = Number(prazoMeses) || 1;
    const taxa = Number(taxaAdmin) || 0;
    const fundo = Number(fundoReserva) || 0;
    const lance = Number(percentualLance) || 0;

    return calcularSimulacao({
      valorCredito: credito,
      prazoMeses: prazo,
      taxaAdminPercent: taxa,
      fundoReservaPercent: fundo,
      percentualLance: lance,
    });
  }, [valorCredito, prazoMeses, taxaAdmin, fundoReserva, percentualLance]);

  async function salvarSimulacao() {
    setSalvando(true);
    setMensagem(null);

    const { error } = await supabase.from("simulacoes").insert({
      lead_id: leadSelecionado || null,
      valor_credito: Number(valorCredito),
      prazo_meses: Number(prazoMeses),
      taxa_admin: Number(taxaAdmin),
      fundo_reserva: Number(fundoReserva),
      percentual_lance: Number(percentualLance),
      parcela_sem_lance: resultado.parcelaSemLance,
      parcela_com_lance: resultado.parcelaComLance,
    });

    setSalvando(false);

    if (error) {
      setMensagem("Não foi possível salvar: " + error.message);
      return;
    }

    setMensagem("Simulação salva com sucesso!");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário de entrada */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Dados da simulação</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Valor do crédito (R$)
          </label>
          <input
            type="number"
            value={valorCredito}
            onChange={(e) => setValorCredito(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prazo (meses)
            </label>
            <input
              type="number"
              value={prazoMeses}
              onChange={(e) => setPrazoMeses(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Taxa de admin. total (%)
            </label>
            <input
              type="number"
              value={taxaAdmin}
              onChange={(e) => setTaxaAdmin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fundo de reserva (%)
            </label>
            <input
              type="number"
              value={fundoReserva}
              onChange={(e) => setFundoReserva(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lance embutido (%)
            </label>
            <input
              type="number"
              value={percentualLance}
              onChange={(e) => setPercentualLance(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
              placeholder="0"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vincular a um lead (opcional)
          </label>
          <select
            value={leadSelecionado}
            onChange={(e) => setLeadSelecionado(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
          >
            <option value="">Nenhum lead selecionado</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.nome}
              </option>
            ))}
          </select>
        </div>

        {mensagem && (
          <p
            className={`text-sm ${mensagem.startsWith("Não") ? "text-rose-600" : "text-emerald-600"}`}
          >
            {mensagem}
          </p>
        )}

        <button
          onClick={salvarSimulacao}
          disabled={salvando}
          className="w-full sm:w-auto bg-[#16233B] hover:bg-[#1f3252] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar simulação"}
        </button>
      </div>

      {/* Resultado calculado em tempo real */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
        <h2 className="text-lg font-semibold text-slate-900">Resultado estimado</h2>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Parcela sem lance
          </p>
          <p className="text-2xl font-bold text-[#16233B]">
            {formatarMoeda(resultado.parcelaSemLance)}
          </p>
        </div>

        {Number(percentualLance) > 0 && resultado.parcelaComLance !== null && (
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-amber-700 uppercase tracking-wide">
              Parcela com lance embutido de {formatarMoeda(resultado.valorLance)}
            </p>
            <p className="text-2xl font-bold text-amber-800">
              {formatarMoeda(resultado.parcelaComLance)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Crédito líquido recebido: {formatarMoeda(resultado.creditoLiquidoComLance)}
            </p>
          </div>
        )}

        <div className="text-sm text-slate-600 space-y-1 pt-2 border-t border-slate-100">
          <p>
            Valor total pago no consórcio:{" "}
            <span className="font-medium">{formatarMoeda(resultado.valorTotalPago)}</span>
          </p>
        </div>

        <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          Estimativa simplificada. Confirme sempre com a tabela oficial da
          administradora antes de formalizar uma proposta ao cliente.
        </p>
      </div>
    </div>
  );
}
