"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

const ITENS = [
  { href: "/leads", label: "Leads", icon: "👥" },
  { href: "/usuarios", label: "Usuários", icon: "👤" },
  { href: "/simulador", label: "Simulador", icon: "🧮" },
  { href: "/funil", label: "Funil", icon: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cpf, logout, usuarioLogado } = useAuth();

  if (pathname === "/auth/login") {
    return null;
  }

  if (!cpf) {
    return null;
  }

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  const cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const nomeUsuario = usuarioLogado?.nome || "Usuário";

  return (
    <>
      <header className="hidden sm:flex items-center justify-between bg-[#16233B] text-white px-6 py-4 shadow-[0_10px_30px_rgba(15,24,40,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm">
            PC
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Consórcio</div>
            <div className="font-semibold tracking-tight">Painel do Consórcio</div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex gap-1 rounded-xl bg-white/5 p-1">
            {ITENS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-white text-[#16233B] shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-l border-white/20 pl-6 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-700 flex items-center justify-center text-sm font-semibold text-white">
                {nomeUsuario.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Conectado</span>
                <span className="text-sm font-medium text-white">{nomeUsuario}</span>
                <span className="text-[11px] text-slate-300">{cpfFormatado}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <span>🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 border-t border-slate-200 flex justify-around py-2 z-10 backdrop-blur-md">
        {ITENS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs gap-0.5 px-3 py-1.5 rounded-lg ${
              pathname === item.href ? "text-[#16233B] font-medium bg-slate-100" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px]">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs gap-0.5 px-3 py-1.5 rounded-lg text-slate-400"
        >
          <span className="text-lg">🚪</span>
          <span className="text-[10px]">Sair</span>
        </button>
      </nav>
    </>
  );
}
