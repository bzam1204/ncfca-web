import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {QueryProvider} from "@/lib/providers/query-provider";
import {SessionProvider} from "next-auth/react";
import {Header} from "@/app/_components/header";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets : ["latin"]});

export const metadata: Metadata = {
  title : "NCFCA",
  description : "Plataforma de Gestão NCFCA",
};

export const viewport: Viewport = {
  width : 'device-width',
  initialScale : 1,
  maximumScale : 1,
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
      <html lang="pt-BR">
      <body className={inter.className}>
      <SessionProvider>
        <QueryProvider>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </QueryProvider>
      </SessionProvider>
      </body>
      </html>
  );
}