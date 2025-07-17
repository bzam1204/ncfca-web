import {DefaultSession} from 'next-auth';
import {DefaultJWT} from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      roles: string[]
      familyId: string;
      lastName: string;
      firstName: string;
    } & DefaultSession['user'];
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
  }
}