// src/app/_components/logout-button.tsx
'use client';

import {Button} from "@/components/ui/button";
import {signOut} from "next-auth/react";
import {LogOut} from "lucide-react";

export function LogoutButton() {
  return (
      <Button variant="ghost" size="icon" onClick={() => signOut({callbackUrl : '/'})}>
        <LogOut className="h-4 w-4" />
      </Button>
  );
}
