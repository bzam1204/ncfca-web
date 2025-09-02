'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';

const REFRESH_INTERVAL: number = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) ?? 60 * 1000;
const REFRESH_THRESHOLD: number = Number(process.env.NEXT_PUBLIC_REFRESH_THRESHOLD) ?? 5 * 60 * 1000;

interface DecodedAccessToken {
  exp: number;
}

export function SessionManager() {
  const { data: session, update } = useSession();
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSession = sessionRef.current;
      if (!currentSession?.accessToken) {
        return;
      }
      try {
        const decodedToken = jwtDecode<DecodedAccessToken>(currentSession.accessToken);
        const expirationTime = decodedToken.exp * 1000;
        const timeRemaining = expirationTime - Date.now();
        if (timeRemaining < REFRESH_THRESHOLD) {
          update();
        }
      } catch (error) {
        console.error('[SessionManager] Erro ao decodificar ou verificar o token:', error);
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [update]);
  return null;
}
