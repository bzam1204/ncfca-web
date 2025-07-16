// auth.config.ts
import type {NextAuthConfig} from 'next-auth';
import {jwtDecode} from 'jwt-decode';
import {UserRoles} from "@/domain/enums/user.roles";

// Tipo para o payload do nosso token de back-end
interface DecodedAccessToken {
  sub: string;
  email: string;
  roles: UserRoles[];
  familyId: string;
  iat: number;
  exp: number;
}

export const authConfig = {
  // A seção 'providers' será definida no ficheiro principal 'auth.ts'
  // para evitar problemas no ambiente 'edge' do middleware.
  providers : [],
  pages : {
    signIn : '/login',
  },
  callbacks : {
    // O authorize SÓ PODE SER USADO no ficheiro principal, não aqui.
    // O middleware usará este callback para decidir se o usuário está logado.
    authorized({auth, request : {nextUrl}}) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      // Adicione este log para depuração. Ele DEVE aparecer no terminal do seu servidor.
      console.log(`[AUTH_MIDDLEWARE] Rota: ${nextUrl.pathname}, Usuário Logado: ${isLoggedIn}`);

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Se o usuário está no dashboard e logado, permita.
        return false; // Se o usuário está no dashboard mas não está logado, negue e redirecione para /login.
      } else if (isLoggedIn) {
        // Se o usuário está logado, mas está a tentar aceder às páginas de login ou registro,
        // redirecione-o para o dashboard para evitar confusão.
        const isOnAuthPages = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
        if (isOnAuthPages) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      // Para todas as outras rotas (ex: '/', '/about'), permita o acesso.
      return true;
    },
    // Estes callbacks continuarão a funcionar para popular o token e a sessão
    async jwt({token, user}) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({session, token}) {
      if (token.accessToken) {
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
} satisfies NextAuthConfig;