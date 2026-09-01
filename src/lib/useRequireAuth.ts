import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";

export function useRequireAuth() {
  const router = useRouter();
  const { cpf, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !cpf) {
      router.push("/auth/login");
    }
  }, [router, cpf, carregando]);
}
