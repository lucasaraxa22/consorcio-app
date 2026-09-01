import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Login - Painel do Consórcio",
  description: "Faça login no painel de gestão de consórcio",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
