// src/app/dashboard/layout.tsx
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {MobileSidebar} from "@/app/_components/mobile-sidebar";
import {LogoutButton} from "@/app/_components/logout-button";
import {DashboardNav} from "@/app/dashboard/_components/dashboard-nav";

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.accessToken) {
    redirect('/login');
  }

  // A validação de afiliação foi removida daqui para permitir o acesso
  // a todas as seções do dashboard, controlando o conteúdo dentro de cada página.

  return (
      // PONTO CRÍTICO 1: O container principal agora controla a altura e esconde o overflow global.
      <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar para Desktop */}
        <aside className="hidden border-r bg-muted/40 md:flex flex-col">
          <div className="flex h-full max-h-screen flex-col justify-between py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <DashboardNav />
            </nav>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between w-full">
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

        {/* Conteúdo Principal */}
        <div className="flex flex-col">
          <MobileSidebar />
          {/* PONTO CRÍTICO 2: A área de <main> agora é o container de scroll. */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-scroll max-h-full max-w-full">
            {children}
          </main>
        </div>
      </div>
  );
}