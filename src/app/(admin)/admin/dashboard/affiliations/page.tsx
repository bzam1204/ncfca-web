// src/app/(admin)/admin/dashboard/affiliations/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/domain/enums/user.roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {AffiliationsTable} from "@/app/(admin)/admin/dashboard/affiliations/_components/affiliation-table";
import {AffiliationDto} from "@/contracts/api/affiliation.dto";

async function getAffiliations(accessToken: string): Promise<AffiliationDto[]> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BACKEND_URL}/admin/affiliations`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de afiliações.');
  return res.json();
}

export default async function AdminAffiliationsPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  const affiliations = await getAffiliations(session.accessToken);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Supervisão de Afiliações</CardTitle>
          <CardDescription>
            Visualize o status de afiliação de todas as famílias na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <AffiliationsTable initialData={affiliations} />
          </Suspense>
        </CardContent>
      </Card>
  );
}
