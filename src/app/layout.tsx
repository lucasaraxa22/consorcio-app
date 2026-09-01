import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel do Consórcio",
  description: "App de gestão de vendas para representante de consórcio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <NavBar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      </body>
    </html>
  );
}
