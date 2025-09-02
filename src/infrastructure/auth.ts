import type { NextAuthConfig, Session } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserRoles } from '@/domain/enums/user.roles';
import { jwtDecode } from 'jwt-decode';
import { NextURL } from 'next/dist/server/web/next-url';

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

async function refreshAccessToken(refreshToken: string): Promise<BackendTokens | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });
    if (!response.ok) {
      console.error('Falha ao renovar o access token. Status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Erro durante a renovação do token:', error);
    return null;
  }
}

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        try {
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          if (!res.ok) return null;
          const user = await res.json();
          return user && user.accessToken ? user : null;
        } catch (error) {
          console.error('Authorization Error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        return token;
      }
      if (trigger === 'update' && session) {
        if (session.accessToken && session.refreshToken) {
          token.accessToken = session.accessToken;
          token.refreshToken = session.refreshToken;
        }
        return token;
      }
      if (!token.accessToken || !token.refreshToken) {
        throw new Error('Não autorizado. Realize o login novamente.');
      }
      const decoded = jwtDecode<DecodedAccessToken>(token.accessToken);
      if (Date.now() >= decoded.exp * 1000) {
        const newTokens = await refreshAccessToken(token.refreshToken);
        if (!newTokens) {
          token.error = 'RefreshAccessTokenError';
          return token;
        }
        token.accessToken = newTokens.accessToken;
        token.refreshToken = newTokens.refreshToken;
        token.error = undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        const decodedToken = jwtDecode<DecodedAccessToken>(token.accessToken);
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = decodedToken.sub;
        session.user.email = decodedToken.email;
        session.user.roles = decodedToken.roles;
        session.user.familyId = decodedToken.familyId;
      }
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isOnAdminPath = nextUrl.pathname.startsWith('/admin');
      if (!isSessionValid(auth)) {
        const refreshToken = auth?.refreshToken;
        if (refreshToken) {
          const newTokens = await refreshAccessToken(refreshToken);
          if (!newTokens) return false;
          auth.accessToken = newTokens.accessToken;
          auth.refreshToken = newTokens.refreshToken;
          const decodedToken = jwtDecode<DecodedAccessToken>(newTokens.accessToken);
          auth.user.roles = decodedToken.roles;
        }
      }
      const isLoggedIn = !!auth?.user;
      if (isOnAdminPath) return everythingIsAlright(isLoggedIn, isSessionValid(auth)) && auth?.user.roles.includes(UserRoles.ADMIN);
      if (isOnHomePage(nextUrl)) return false;
      if (isOnAuthPages(nextUrl) && !everythingIsAlright(isLoggedIn, isSessionValid(auth))) return true;
      if (isOnCheckout(nextUrl) && everythingIsAlright(isLoggedIn, isSessionValid(auth) && !(await isAffiliated()))) return true;
      if (everythingIsAlright(isLoggedIn, isSessionValid(auth)) && !(await isAffiliated()) && !auth?.user.roles.includes(UserRoles.ADMIN))
        return Response.redirect(new URL('/checkout', nextUrl));
      if (isOnDashboard(nextUrl) && everythingIsAlright(isLoggedIn, isSessionValid(auth))) return true;
      if (isOnAuthPages(nextUrl) && everythingIsAlright(isLoggedIn, isSessionValid(auth))) return Response.redirect(new URL('/dashboard', nextUrl));
      return false;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

async function isAffiliated(): Promise<boolean> {
  // TODO: Migrar para novo padrão Hook → Action → Gateway
  // const family = await getMyFamily();
  // if (!family) return false;
  // return family.status === FamilyStatus.AFFILIATED;
  return true; // Placeholder até migração completa
}

export function isTokenExpired(token: string, decoder: (token: string) => DecodedAccessToken): boolean {
  const decoded = decoder(token);
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

function isOnCheckout(nextUrl: NextURL) {
  return nextUrl.pathname.startsWith('/checkout');
}

function isSessionValid(auth: Session | null) {
  const token = auth?.accessToken;
  if (!token) return false;
  return !auth?.error && !isTokenExpired(token, jwtDecode<DecodedAccessToken>);
}
