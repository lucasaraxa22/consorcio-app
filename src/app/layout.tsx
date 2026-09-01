import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel do Consórcio",
  description: "App de gestão de vendas para representante de consórcio",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <AuthProvider>
          <NavBar />
          <main className="flex-1 pb-16 sm:pb-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
