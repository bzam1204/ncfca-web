import type { Metadata, Viewport } from 'next';

import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

import { SessionManager } from '@/components/session-manager';
import { Toaster } from '@/components/ui/sonner';

import { QueryProvider } from '@/infrastructure/providers/query-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NCFCA',
  description: 'Plataforma de Gestão NCFCA',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className + ' w-screen h-screen bg-gray-200'}>
        <SessionProvider>
          <SessionManager />
          <QueryProvider>
            {children}
            <Toaster richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
