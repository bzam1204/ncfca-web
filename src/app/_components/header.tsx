// src/app/_components/header.tsx
import Link from "next/link";
import {auth} from "@/infrastructure/auth";
import {Button} from "@/components/ui/button";
import {LogoutButton} from "./logout-button";

export async function Header() {
  const session = await auth();

  return (
      <header
          className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">NCFCA</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            {session?.user ? (
                <>
                  <span className="text-sm font-medium">{session.user.email}</span>
                  <LogoutButton />
                </>
            ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Registrar-se</Link>
                  </Button>
                </>
            )}
          </div>
        </div>
      </header>
  );
}
