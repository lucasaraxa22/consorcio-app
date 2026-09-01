"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useState } from "react";

const ITENS = [
  { href: "/leads", label: "Leads", icon: "👥" },
  { href: "/usuarios", label: "Usuários", icon: "👤" },
  { href: "/simulador", label: "Simulador", icon: "🧮" },
  { href: "/funil", label: "Funil", icon: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { cpf, logout, usuarioLogado } = useAuth();
  const [descricaoAberta, setDescricaoAberta] = useState(false);

  // Não mostra NavBar na página de login
  if (pathname === "/auth/login") {
    return null;
  }

  // Se não está logado, não mostra
  if (!cpf) {
    return null;
  }

  async function handleLogout() {
    await logout();
  }

  const cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const nomeUsuario = usuarioLogado?.nome || "Usuário";

  return (
    <>
      {/* Menu de topo no PC */}
      <header className="hidden sm:flex items-center justify-between bg-[#16233B] text-white px-6 py-4">
        <span className="font-semibold tracking-tight">
          Painel do Consórcio
        </span>
        <div className="flex items-center gap-8">
          <nav className="flex gap-1">
            {ITENS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  pathname === item.href
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-l border-white/20 pl-8 flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs text-white/50">Conectado como</span>
              <span className="text-sm text-white/70">{nomeUsuario}</span>
              <span className="text-xs text-white/50">{cpfFormatado}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Menu inferior fixo no celular */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {ITENS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs gap-0.5 px-3 py-1 rounded-lg ${
              pathname === item.href ? "text-[#16233B] font-medium" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs gap-0.5 px-3 py-1 rounded-lg text-slate-400"
        >
          <span className="text-lg">🚪</span>
          <span className="text-xs">Sair</span>
        </button>
      </nav>
    </>
  );
}
