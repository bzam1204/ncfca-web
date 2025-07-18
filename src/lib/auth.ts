import type {NextAuthConfig, Session} from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {UserRoles} from "@/domain/enums/user.roles";
import {jwtDecode} from "jwt-decode";
import {NextURL} from "next/dist/server/web/next-url";

// --- TIPOS DE DADOS ---
interface DecodedAccessToken {
  sub: string;
  email: string;
  roles: UserRoles[];
  familyId: string;
  iat: number;
  exp: number;
}

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
}

// --- LÓGICA DE REFRESH ---

/**
 * PONTO CRÍTICO 1: A FUNÇÃO DE REFRESH (CORRIGIDA)
 * Alinhada com o openapi.json para usar o endpoint e o payload corretos.
 */
async function refreshAccessToken(refreshToken: string): Promise<BackendTokens | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    // CORREÇÃO: O endpoint é /auth/refresh-token
    const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      // CORREÇÃO: O corpo do request espera um campo "token".
      body : JSON.stringify({token : refreshToken}),
    });

    if (!response.ok) {
      console.error("Falha ao renovar o access token. Status:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro durante a renovação do token:", error);
    return null;
  }
}

// --- CONFIGURAÇÃO PRINCIPAL DO NEXT-AUTH ---
export const authConfig = {
  pages : {
    signIn : '/login',
  },
  providers : [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        try {
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(credentials),
          });
          if (!res.ok) return null;
          const user = await res.json();
          return user && user.accessToken ? user : null;
        } catch (error) {
          console.error("Authorization Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks : {
    async jwt({token, user}) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        return token;
      }
      if (!token.accessToken || !token.refreshToken) throw new Error("Não autorizado. Realize o login novamente. tem accessToken");
      if (!isTokenExpired(token.accessToken, jwtDecode<DecodedAccessToken>)) {
        token.error = undefined;
        return token;
      }
      console.log('!! o c[odigo t[a aqui')
      const newTokens = await refreshAccessToken(token.refreshToken);
      if (!newTokens) {
        console.log('não teve token');
        token.error = "RefreshAccessTokenError";
        return token;
      }
      token.accessToken = newTokens.accessToken;
      token.refreshToken = newTokens.refreshToken;
      token.error = undefined;
      return token;
    },
    async session({session, token}) {
      if (token.accessToken) {
        const decodedToken = jwtDecode<DecodedAccessToken>(token.accessToken);
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = decodedToken.sub;
        session.user.email = decodedToken.email;
        (session.user as any).roles = decodedToken.roles;
        (session.user as any).familyId = decodedToken.familyId;
      }
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
    async authorized({auth, request : {nextUrl}}) {
      if (!isSessionValid(auth)) {
        const refreshToken = auth?.refreshToken;
        if (!refreshToken) return false;
        const newTokens = await refreshAccessToken(refreshToken);
        if (!newTokens) return false;
        auth.accessToken = newTokens.accessToken;
        auth.refreshToken = newTokens.refreshToken;
      }
      const isLoggedIn = !!auth?.user;
      if (isOnHomePage(nextUrl)) return false
      if (isOnAuthPages(nextUrl) && !everythingIsAlright(isLoggedIn, isSessionValid(auth))) return true;
      if (isOnDashboard(nextUrl) && everythingIsAlright(isLoggedIn, isSessionValid(auth))) return true;
      if (isOnAuthPages(nextUrl) && everythingIsAlright(isLoggedIn, isSessionValid(auth))) return Response.redirect(new URL('/dashboard', nextUrl));
      return false;
    },
  },
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(authConfig);

export function isTokenExpired(token: string, decoder: (token: string) => DecodedAccessToken): boolean {
  const decoded = decoder(token);
  console.log('expira em: ', (decoded.exp * 1000 - Date.now()) / 1000);
  return Date.now() >= decoded.exp * 1000;
}

function isOnAuthPages(nextUrl: NextURL) {
  return nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
}

function everythingIsAlright(isLoggedIn: boolean, isSessionValid: boolean) {
  return isLoggedIn && isSessionValid;
}

function isOnHomePage(nextUrl: NextURL) {
  return nextUrl.pathname === '/';
}

function isOnDashboard(nextUrl: NextURL) {
  return nextUrl.pathname.startsWith('/dashboard');
}

function isSessionValid(auth: Session | null) {
  return !auth?.error && !isTokenExpired(auth?.accessToken as string, jwtDecode<DecodedAccessToken>);
}