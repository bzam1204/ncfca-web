// src/app/dashboard/layout.tsx
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {Header} from "@/app/_components/header";
import {Family} from "@/domain/entities/entities";
import {DashboardNav} from "@/app/_components/dashboard-nav";
import {MobileSidebar} from "@/app/_components/mobile-sidebar";
import {LogoutButton} from "@/app/_components/logout-button";

// Esta função faz a chamada à API do back-end para buscar os dados da família
async function getFamily(accessToken: string): Promise<Family | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${BACKEND_URL}/dependants/my-family`, {
      headers : {'Authorization' : `Bearer ${accessToken}`}
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode;
}) {
  const session = await auth(); // A sessão já está a ser obtida aqui.
  if (!session?.accessToken) {
    redirect('/login');
  }
  const family = await getFamily(session.accessToken);
  if (family?.status !== FamilyStatus.AFFILIATED) {
    redirect('/checkout');
  }
  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col justify-between py-4">
            {/* Navegação Principal */}
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <DashboardNav />
            </nav>

            {/* 2. Área do Usuário e Logout no Rodapé do Sidebar */}
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                                <span className="text-sm font-semibold leading-none">
                                    {session.user.name || session.user.email}
                                </span>
                  <span className="text-xs text-muted-foreground">
                                    Responsável Familiar
                                </span>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-col">
          <MobileSidebar />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
  );
}