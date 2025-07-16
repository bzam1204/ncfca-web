'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
  SheetHeader, // 1. Importar SheetHeader
  SheetTitle,  // 2. Importar SheetTitle
  SheetDescription // 3. Importar SheetDescription
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {DashboardNav} from "./dashboard-nav";
import {useSession} from "next-auth/react";
import {LogoutButton} from "@/app/_components/logout-button";

export function MobileSidebar() {
  const {data : session} = useSession();

  return (
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu de navegação</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            {/* 4. Adicionar o cabeçalho para acessibilidade */}
            <SheetHeader className="sr-only">
              <SheetTitle>Menu de Navegação</SheetTitle>
              <SheetDescription>
                Navegue pelas seções do seu painel, como dependentes e afiliação.
              </SheetDescription>
            </SheetHeader>

            <nav className="grid gap-6 text-lg font-medium mt-4">
              <DashboardNav />
            </nav>

            <SheetFooter className="mt-auto border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span
                      className="text-sm font-semibold leading-none">{session?.user?.name || session?.user?.email}</span>
                  <span className="text-xs text-muted-foreground">Responsável Familiar</span>
                </div>
                <LogoutButton />
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <span className="font-bold">NCFCA Dashboard</span>
        </div>
      </header>
  );
}
