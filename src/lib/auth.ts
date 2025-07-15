// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const config = {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        try {
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            // A API retornou um erro (ex: 401 Unauthorized)
            console.error("Falha na autenticação com o backend:", await res.text());
            return null;
          }

          const user = await res.json();

          // O objeto retornado aqui será passado para o callback 'jwt'
          if (user && user.accessToken) {
            return user; // Retorne o objeto completo que vem do seu backend
          }

          return null;
        } catch (error) {
          console.error("Erro de rede ou de servidor ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // O callback 'jwt' é chamado para codificar o token da sessão do NextAuth.
    // Nós o usamos para injetar o accessToken do nosso backend no token do NextAuth.
    async jwt({ token, user }) {
      // 'user' só está presente no primeiro login.
      // O objeto 'user' aqui é o que foi retornado pelo 'authorize'.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    // O callback 'session' é chamado para criar o objeto 'session'
    // que é acessível no lado do cliente.
    async session({ session, token }) {
      // Passamos o accessToken do token JWT para o objeto da sessão.
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redireciona para a nossa página de login customizada
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);