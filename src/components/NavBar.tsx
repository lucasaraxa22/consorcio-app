"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/leads", label: "Leads", icon: "👥" },
  // Próximos módulos entram aqui, seguindo o mesmo padrão:
  // { href: "/simulador", label: "Simulador", icon: "🧮" },
  // { href: "/funil", label: "Funil", icon: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Menu de topo no PC */}
      <header className="hidden sm:flex items-center justify-between bg-[#16233B] text-white px-6 py-4">
        <span className="font-semibold tracking-tight">
          Painel do Consórcio
        </span>
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
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
