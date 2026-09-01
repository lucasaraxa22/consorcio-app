"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";

export default function Home() {
  const { email, carregando } = useAuth();

  useEffect(() => {
    if (!carregando) {
      if (!email) {
        redirect("/auth/login");
      } else {
        redirect("/leads");
      }
    }
  }, [email, carregando]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-500">Redirecionando...</p>
    </div>
  );
}
