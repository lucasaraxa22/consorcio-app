"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { User } from "./types";

interface AuthContextType {
  usuarioLogado: User | null;
  email: string | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  registrar: (cpf: string, nome: string, email: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica autenticação ao montar
  useEffect(() => {
    checkAuth();
    
    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setEmail(session.user.email || null);
          carregarUsuario(session.user.email);
        } else {
          setEmail(null);
          setUsuarioLogado(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.email) {
        setEmail(session.user.email);
        await carregarUsuario(session.user.email);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarUsuario(userEmail: string) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (!error && data) {
        setUsuarioLogado(data as User);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }

  async function login(emailLogin: string, senha: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailLogin,
      password: senha,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUsuarioLogado(null);
    setEmail(null);
  }

  async function registrar(cpf: string, nome: string, emailRegistro: string, senha: string) {
    // 1. Cria a conta no Auth do Supabase
    const { error: authError } = await supabase.auth.signUp({
      email: emailRegistro,
      password: senha,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 2. Cria o registro na tabela usuarios
    const apenasNumeros = cpf.replace(/\D/g, "");
    const { error: dbError } = await supabase.from("usuarios").insert({
      cpf: apenasNumeros,
      nome: nome.trim(),
      email: emailRegistro.trim().toLowerCase(),
    });

    if (dbError) {
      throw new Error(dbError.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuarioLogado,
        email,
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
