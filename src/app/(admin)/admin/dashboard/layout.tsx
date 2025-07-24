import {redirect} from "next/navigation";

import {UserRoles} from "@/domain/enums/user.roles";

import {auth} from "@/lib/auth";

import {AdminSidebar} from "@/app/(admin)/admin/dashboard/_components/admin-sidebar";

import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export default async function AdminDashboardLayout({children}: {children: React.ReactNode;}) {
  const session = await auth();
  if (!session?.user || !session.user.roles.includes(UserRoles.ADMIN)) redirect('/login');
  return (
      <main className="h-full flex justify-center">
        <div className="h-full w-full max-w-[2048px] flex justify-center">
          <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
              <header
                  className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                </div>
              </header>
              <div data-fig className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </main>
  );
}