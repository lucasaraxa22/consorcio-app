"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { User } from "./types";

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

  const hashPassword = async (senha: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const digest = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  // Verifica autenticação ao montar
  useEffect(() => {
    let ignore = false;
    const storedCPF = typeof window !== "undefined" ? localStorage.getItem("usuario_cpf") : null;

    if (!storedCPF) {
      Promise.resolve().then(() => {
        if (!ignore) {
          setCarregando(false);
        }
      });
      return () => {
        ignore = true;
      };
    }

    supabase
      .from("usuarios")
      .select("*")
      .eq("cpf", storedCPF)
      .single()
      .then(
        ({ data, error }) => {
          if (!ignore) {
            setCpf(storedCPF);
            if (!error && data) {
              setUsuarioLogado(data as User);
            }
            setCarregando(false);
          }
        },
        (error: unknown) => {
          if (!ignore) {
            console.error("Erro ao carregar usuário:", error);
            setCarregando(false);
          }
        }
      );

    return () => {
      ignore = true;
    };
  }, []);

  async function login(cpfLogin: string, senha: string) {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("cpf", cpfLogin)
      .single();

    if (error || !usuario) {
      throw new Error("CPF não encontrado");
    }

    const senhaHash = await hashPassword(senha);

    if (usuario.senha !== senhaHash) {
      throw new Error("Senha incorreta");
    }

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
    const senhaHash = await hashPassword(senha);

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
