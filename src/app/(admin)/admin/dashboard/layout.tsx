// src/app/(admin)/admin/dashboard/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/app/(admin)/_components/admin-nav";
import { AdminMobileSidebar } from "@/app/(admin)/_components/admin-mobile-sidebar";
import { LogoutButton } from "@/app/_components/logout-button";
import { UserRoles } from "@/domain/enums/user.roles";

export default async function AdminDashboardLayout({
                                                     children,
                                                   }: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Dupla verificação de segurança, embora o middleware já deva barrar.
  if (!session?.user || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  return (
      <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar para Desktop */}
        <aside className="hidden border-r bg-muted/40 md:flex flex-col">
          <div className="flex h-full max-h-screen flex-col justify-between py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-4">
                <span className="font-bold text-lg">PAINEL ADMIN</span>
              </div>
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <AdminNav />
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-none">
                        {session.user.name || session.user.email}
                    </span>
                  <span className="text-xs text-muted-foreground">
                        Administrador
                    </span>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex flex-col">
          <AdminMobileSidebar />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto max-h-screen">
            {children}
          </main>
        </div>
      </div>
  );
}