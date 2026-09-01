"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface LeadFormProps {
  onCreated: () => void; // função chamada depois que salva com sucesso, pra atualizar a lista
}

export default function LeadForm({ onCreated }: LeadFormProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [interesse, setInteresse] = useState("");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("O nome é obrigatório.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.from("leads").insert({
      nome: nome.trim(),
      telefone: telefone.trim() || null,
      email: email.trim() || null,
      interesse: interesse.trim() || null,
      valor_credito_desejado: valor ? Number(valor) : null,
      status: "novo",
    });

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar: " + error.message);
      return;
    }

    // limpa o formulário e avisa a página pra recarregar a lista
    setNome("");
    setTelefone("");
    setEmail("");
    setInteresse("");
    setValor("");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
    >
      <h2 className="text-lg font-semibold text-slate-900">Novo lead</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome *
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefone
          </label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            E-mail
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="cliente@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Interesse
          </label>
          <input
            value={interesse}
            onChange={(e) => setInteresse(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="Imóvel, veículo, pesado..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Valor de crédito desejado (R$)
          </label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="50000"
          />
        </div>
      </div>

      {erro && <p className="text-sm text-rose-600">{erro}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="w-full sm:w-auto bg-[#16233B] hover:bg-[#1f3252] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar lead"}
      </button>
    </form>
  );
}
