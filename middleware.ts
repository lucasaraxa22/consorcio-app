import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // Pula o middleware para rotas de auth
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Tenta obter a sessão
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Lê o cookie de autenticação do Supabase
  const token = request.cookies.get("sb-access-token")?.value;

  // Se não tem token e não está em /auth/login, redireciona
  if (!token && request.nextUrl.pathname !== "/auth/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
