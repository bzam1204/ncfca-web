import NextAuth from 'next-auth';
import {authConfig} from "@/infraestructure/auth";

export default NextAuth(authConfig).auth;

export const config = {
  matcher : ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
