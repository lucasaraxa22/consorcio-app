"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { cpf, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !cpf) {
      router.push("/auth/login");
    }
  }, [cpf, carregando, router]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!cpf) {
    return null;
  }

  return <>{children}</>;
}
