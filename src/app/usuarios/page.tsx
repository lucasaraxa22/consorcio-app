"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { User } from "@/lib/types";
import UserForm from "@/components/UserForm";
import UserList from "@/components/UserList";

export default function UsuariosPage() {
  useRequireAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data as User[]);
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
        <p className="text-slate-500 text-sm mt-1">
          Cadastre novos usuários do sistema com CPF, nome e e-mail.
        </p>
      </div>

      <UserForm onCreated={carregarUsuarios} />

      {carregando ? (
        <p className="text-sm text-slate-400">Carregando usuários...</p>
      ) : (
        <UserList users={users} onChanged={carregarUsuarios} />
      )}
    </div>
  );
}
