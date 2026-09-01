import { createClient } from "@supabase/supabase-js";

// Estas duas variáveis vêm do arquivo .env.local (veja .env.local.example)
// Elas dizem ao app QUAL banco de dados Supabase usar e a "chave" de acesso.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Isso só aparece se você esquecer de configurar o .env.local
  // (usamos valores de "espera" aqui só para o app não quebrar antes de você configurar)
  console.warn(
    "Supabase não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local"
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
