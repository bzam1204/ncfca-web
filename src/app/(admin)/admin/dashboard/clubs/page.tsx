// src/app/(admin)/admin/dashboard/clubs/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/domain/enums/user.roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ClubDto } from "@/contracts/api/club.dto";
import { UserDto } from "@/contracts/api/user.dto";
import {ClubsTable} from "@/app/(admin)/admin/dashboard/clubs/_components/clubs-table";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getClubs(accessToken: string): Promise<ClubDto[]> {
  const res = await fetch(`${BACKEND_URL}/admin/clubs`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de clubes.');
  return res.json();
}

async function getUsers(accessToken: string): Promise<UserDto[]> {
  const res = await fetch(`${BACKEND_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de usuários.');
  return res.json();
}

export default async function AdminClubsPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  const clubs = await getClubs(session.accessToken);
  const users = await getUsers(session.accessToken);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Clubes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os clubes registrados na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <ClubsTable initialClubs={clubs} allUsers={users} />
          </Suspense>
        </CardContent>
      </Card>
  );
}