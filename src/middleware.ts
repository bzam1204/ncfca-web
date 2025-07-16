// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import {jwtDecode} from "jwt-decode";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isLoggedIn = jwtDecode(session?.accessToken ?? '')
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isOnDashboard = pathname.startsWith('/dashboard');
  const isOnAuthPages = pathname.startsWith('/login') || pathname.startsWith('/register');

  // REGRA 2: Proteger as rotas do dashboard
  if (isOnDashboard) {
    if (isLoggedIn) return NextResponse.next(); // Permitir acesso
    return NextResponse.redirect(new URL('/login', request.url)); // Bloquear e redirecionar
  }

  // REGRA 3: Impedir que usuários logados acessem as páginas de login/registro
  if (isLoggedIn && isOnAuthPages) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // REGRA 4 (Padrão): Permitir todas as outras requisições
  return NextResponse.next();
}

export const config = {
  // O matcher continua a aplicar o middleware a todas as rotas relevantes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};