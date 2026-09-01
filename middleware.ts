import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Pula o middleware para rotas de auth e arquivos públicos
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // A proteção agora é feita no lado do cliente com useRequireAuth hook
  // Middleware apenas deixa passar todas as rotas
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
