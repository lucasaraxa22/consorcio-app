"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";

export default function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { login, registrar } = useAuth();

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

  function validarCPF(cpfValue: string): boolean {
    const apenasNumeros = cpfValue.replace(/\D/g, "");
    if (apenasNumeros.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(apenasNumeros)) return false;
    return true;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      if (!cpf.trim()) {
        setErro("CPF é obrigatório.");
        setCarregando(false);
        return;
      }
      if (!validarCPF(cpf)) {
        setErro("CPF inválido.");
        setCarregando(false);
        return;
      }
      if (!senha.trim()) {
        setErro("Senha é obrigatória.");
        setCarregando(false);
        return;
      }

      await login(cpf.replace(/\D/g, ""), senha);
      router.push("/leads");
    } catch (err: any) {
      setErro(err.message || "Erro ao fazer login");
      setCarregando(false);
    }
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      if (!cpf.trim()) {
        setErro("CPF é obrigatório.");
        setCarregando(false);
        return;
      }
      if (!validarCPF(cpf)) {
        setErro("CPF inválido.");
        setCarregando(false);
        return;
      }
      if (!nome.trim()) {
        setErro("Nome é obrigatório.");
        setCarregando(false);
        return;
      }
      if (!email.trim()) {
        setErro("E-mail é obrigatório.");
        setCarregando(false);
        return;
      }
      if (!senha.trim()) {
        setErro("Senha é obrigatória.");
        setCarregando(false);
        return;
      }
      if (senha.length < 6) {
        setErro("Senha deve ter no mínimo 6 caracteres.");
        setCarregando(false);
        return;
      }

      await registrar(cpf.replace(/\D/g, ""), nome, email, senha);

      // Sucesso - volta para login
      setModo("login");
      setEmail("");
      setSenha("");
      setCpf("");
      setNome("");
      setErro(null);
      setCarregando(false);
    } catch (err: any) {
      setErro(err.message || "Erro ao registrar");
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16233B] to-[#0f1828] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel do Consórcio</h1>
          <p className="text-slate-300">Gestão de vendas para consórcio</p>
        </div>

        {/* Card de Login/Registro */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Abas */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setModo("login")}
              className={`flex-1 py-2 px-4 font-medium text-sm transition ${
                modo === "login"
                  ? "text-[#16233B] border-b-2 border-[#16233B]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setModo("registro")}
              className={`flex-1 py-2 px-4 font-medium text-sm transition ${
                modo === "registro"
                  ? "text-[#16233B] border-b-2 border-[#16233B]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Registrar
            </button>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {/* Formulário LOGIN */}
          {modo === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => formatarCPF(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#16233B] hover:bg-[#0f1828] text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          {/* Formulário REGISTRO */}
          {modo === "registro" && (
            <form onSubmit={handleRegistro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  CPF
                </label>
                <input
                  value={cpf}
                  onChange={(e) => formatarCPF(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome completo
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16233B]"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#16233B] hover:bg-[#0f1828] text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
              >
                {carregando ? "Registrando..." : "Registrar"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          © 2024 Painel do Consórcio
        </p>
      </div>
    </div>
  );
}
