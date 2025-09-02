// src/app/(admin)/admin/dashboard/affiliations/page.tsx
import { auth } from '@/infrastructure/auth';
import { redirect } from 'next/navigation';
import { UserRoles } from '@/domain/enums/user.roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AffiliationsTable } from '@/app/(admin)/admin/dashboard/affiliations/_components/affiliation-table';
import { getAffiliationsAction } from '@/infrastructure/actions/admin/get-affiliations.action';

export default async function AdminAffiliationsPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  const affiliations = await getAffiliationsAction();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervisão de Afiliações</CardTitle>
        <CardDescription>Visualize o status de afiliação de todas as famílias na plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <AffiliationsTable initialData={affiliations} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
