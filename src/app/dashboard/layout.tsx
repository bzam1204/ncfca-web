import { redirect } from 'next/navigation';

import { auth } from '@/infrastructure/auth';

import { DashboardSidebar } from '@/app/dashboard/_components/dashboard-sidebar';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.accessToken) redirect('/login');
  return (
    <main className="h-full flex justify-center">
      <div className="h-full w-full max-w-[2048px] flex justify-center">
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
}
