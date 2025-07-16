// src/lib/auth.ts (Versão Unificada)

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import {UserRoles} from "@/domain/enums/user.roles";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface DecodedAccessToken {
  sub: string;
  email: string;
  roles: UserRoles[];
  familyId: string;
  iat: number;
  exp: number;
}

const config = {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // A lógica de jwt e session permanece a mesma. Essencial para popular os dados.
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        console.log('rodoou o session callback');
        const decodedToken = jwtDecode<DecodedAccessToken>(token.accessToken as string);
        session.accessToken = token.accessToken as string;
        session.user.id = decodedToken.sub;
        session.user.email = decodedToken.email;
        (session.user as any).roles = decodedToken.roles;
        (session.user as any).familyId = decodedToken.familyId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);