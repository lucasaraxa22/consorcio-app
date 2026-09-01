"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { User } from "./types";
import crypto from "crypto";

interface AuthContextType {
  usuarioLogado: User | null;
  cpf: string | null;
  carregando: boolean;
  login: (cpf: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  registrar: (cpf: string, nome: string, email: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
  const [cpf, setCpf] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const hashPassword = (senha: string): string => {
    return crypto.createHash("sha256").update(senha).digest("hex");
  };

  // Verifica autenticação ao montar
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const storedCPF = localStorage.getItem("usuario_cpf");
      if (storedCPF) {
        setCpf(storedCPF);
        await carregarUsuario(storedCPF);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarUsuario(userCPF: string) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("cpf", userCPF)
        .single();

      if (!error && data) {
        setUsuarioLogado(data as User);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }

  async function login(cpfLogin: string, senha: string) {
    // Query o usuário pela CPF
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("cpf", cpfLogin)
      .single();

    if (error || !usuario) {
      throw new Error("CPF não encontrado");
    }

    // Hash a senha enviada
    const senhaHash = hashPassword(senha);

    // Compara com a senha armazenada
    if (usuario.senha !== senhaHash) {
      throw new Error("Senha incorreta");
    }

    // Autenticação bem-sucedida
    localStorage.setItem("usuario_cpf", cpfLogin);
    setCpf(cpfLogin);
    setUsuarioLogado(usuario as User);
  }

  async function logout() {
    localStorage.removeItem("usuario_cpf");
    setUsuarioLogado(null);
    setCpf(null);
  }

  async function registrar(cpf: string, nome: string, emailRegistro: string, senha: string) {
    // Hash da senha
    const senhaHash = hashPassword(senha);

    // Cria o registro na tabela usuarios com a senha hashada
    const { error: dbError } = await supabase.from("usuarios").insert({
      cpf: cpf,
      nome: nome.trim(),
      email: emailRegistro.trim().toLowerCase(),
      senha: senhaHash,
    });

    if (dbError) {
      throw new Error(dbError.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuarioLogado,
        cpf,
        carregando,
        login,
        logout,
        registrar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
