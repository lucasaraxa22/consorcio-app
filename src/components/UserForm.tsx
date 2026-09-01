"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserFormProps {
  onCreated: () => void;
}

export default function UserForm({ onCreated }: UserFormProps) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function hashPassword(senha: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const digest = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Formata o CPF enquanto digita (XXX.XXX.XXX-XX)
  function formatarCPF(valor: string) {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length <= 11) {
      const formatado = apenasNumeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{2})$/, "$1-$2");
      setCpf(formatado);
    }
  }

  // Valida CPF (algoritmo básico)
  function validarCPF(cpf: string): boolean {
    const apenasNumeros = cpf.replace(/\D/g, "");
    
    if (apenasNumeros.length !== 11) {
      return false;
    }

    // Rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(apenasNumeros)) {
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    // Validações
    if (!nome.trim()) {
      setErro("O nome é obrigatório.");
      return;
    }

    if (!cpf.trim()) {
      setErro("O CPF é obrigatório.");
      return;
    }

    if (!validarCPF(cpf)) {
      setErro("CPF inválido.");
      return;
    }

    if (!email.trim()) {
      setErro("O e-mail é obrigatório.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("E-mail inválido.");
      return;
    }

    if (!senha.trim()) {
      setErro("A senha é obrigatória.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSalvando(true);

    const apenasNumeros = cpf.replace(/\D/g, "");
    const senhaHash = await hashPassword(senha);

    const { error } = await supabase.from("usuarios").insert({
      cpf: apenasNumeros,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senhaHash,
    });

    setSalvando(false);

    if (error) {
      if (error.message.includes("duplicate")) {
        setErro("Este CPF ou e-mail já está cadastrado.");
      } else {
        setErro("Não foi possível salvar: " + error.message);
      }
      return;
    }

    // Sucesso
    setSucesso(true);
    setNome("");
    setCpf("");
    setEmail("");
    setSenha("");
    setTimeout(() => setSucesso(false), 3000);
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/85 rounded-3xl border border-slate-200 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Registro</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Novo usuário</h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg">
          👤
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-sm text-emerald-700">
          ✓ Usuário cadastrado com sucesso!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            CPF *
          </label>
          <input
            value={cpf}
            onChange={(e) => formatarCPF(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="000.000.000-00"
            maxLength={14}
          />
          <p className="text-xs text-slate-500 mt-1">
            Formato: XXX.XXX.XXX-XX
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome completo *
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="João Silva Santos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            E-mail *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="joao@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Senha *
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16233B]"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="w-full bg-[#16233B] hover:bg-[#0f1828] text-white font-medium py-2.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-slate-900/10"
      >
        {salvando ? "Salvando..." : "Cadastrar usuário"}
      </button>
    </form>
  );
}
