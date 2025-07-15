import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {QueryProvider} from "@/lib/providers/query-provider";
import {SessionProvider} from "next-auth/react";

const inter = Inter({subsets : ["latin"]});

export const metadata: Metadata = {
  title : "NCFCA",
  description : "Plataforma de Gestão NCFCA",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
      <html lang="pt-BR">
      <body className={inter.className}>
      <SessionProvider>
        <QueryProvider>{children}</QueryProvider>
      </SessionProvider>
      </body>
      </html>
  );
}