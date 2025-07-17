import type {NextAuthConfig} from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {jwtDecode} from 'jwt-decode';
import {UserRoles} from "@/domain/enums/user.roles";

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
    /**
     * PONTO CRÍTICO 2: O GATEKEEPER NO CALLBACK JWT
     * Esta lógica permanece a mesma, pois é o motor do fluxo.
     */
    async jwt({token, user}) {
      // Primeira vez, após o login.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        return token;
      }

      // Nas chamadas subsequentes.
      if (token.accessToken) {
        const decoded = jwtDecode<DecodedAccessToken>(token.accessToken);

        // Se o token ainda é válido.
        if (Date.now() < decoded.exp * 1000) {
          return token;
        }

        // Se o token expirou, tente renová-lo.
        if (!token.refreshToken) {
          console.error("Access token expirado, mas nenhum refresh token disponível.");
          return {...token, error : "RefreshAccessTokenError"};
        }

        const newTokens = await refreshAccessToken(token.refreshToken as string);

        if (newTokens) {
          // Renovação bem-sucedida.
          token.accessToken = newTokens.accessToken;
          token.refreshToken = newTokens.refreshToken;
          token.error = undefined; // Limpa qualquer erro anterior.
        } else {
          // Renovação falhou.
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },

    /**
     * PONTO CRÍTICO 3: PROPAGAÇÃO PARA A SESSÃO
     */
    async session({session, token}) {
      if (token.accessToken) {
        const decodedToken = jwtDecode<DecodedAccessToken>(token.accessToken as string);
        session.accessToken = token.accessToken as string;
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

    /**
     * PONTO CRÍTICO 4: O GUARDA DA FRONTEIRA ATUALIZADO
     */
    authorized({auth, request : {nextUrl}}) {
      const isLoggedIn = !!auth?.user;
      const isSessionValid = !auth?.error;

      const isOnHomePage = nextUrl.pathname === '/';
      if (isOnHomePage) return Response.redirect(new URL('/login', nextUrl));
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn && isSessionValid) return true;
        return false;
      } else if (isLoggedIn && isSessionValid) {
        const isOnAuthPages = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
        if (isOnAuthPages) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(authConfig);