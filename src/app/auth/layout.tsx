import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Login - Painel do Consórcio",
  description: "Faça login no painel de gestão de consórcio",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
