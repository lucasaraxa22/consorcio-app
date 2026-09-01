"use client";

import { User } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

interface UserListProps {
  users: User[];
  onChanged: () => void;
}

export default function UserList({ users, onChanged }: UserListProps) {
  // Formata o CPF para exibição
  function formatarCPFExibicao(cpf: string): string {
    return cpf
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{2})$/, "$1-$2");
  }

  async function excluir(id: string) {
    const confirmado = window.confirm("Excluir este usuário?");
    if (!confirmado) return;
    
    await supabase.from("usuarios").delete().eq("id", id);
    onChanged();
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
        Nenhum usuário cadastrado ainda. Use o formulário acima para começar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#16233B] to-[#0f1828] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {user.nome}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {formatarCPFExibicao(user.cpf)} · {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => excluir(user.id)}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
