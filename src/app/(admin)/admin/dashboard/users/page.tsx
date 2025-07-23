// src/app/(admin)/admin/dashboard/users/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/domain/enums/user.roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {UsersTable} from "@/app/(admin)/admin/dashboard/users/_components/users-table";

// A função de fetch precisa ser definida fora do escopo do hook para ser usada em Server Components
async function getUsers(accessToken: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BACKEND_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    cache: 'no-store', // Garante que os dados sejam sempre frescos
  });
  if (!res.ok) {
    // Em um cenário real, trataríamos o erro de forma mais elegante
    throw new Error('Falha ao buscar a lista de usuários.');
  }
  return res.json();
}


export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  const users = await getUsers(session.accessToken);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Visualize, filtre e gerencie os perfis de todos os usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <UsersTable initialData={users} />
          </Suspense>
        </CardContent>
      </Card>
  );
}