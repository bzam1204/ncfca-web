// src/app/dashboard/club-management/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ClubDto } from '@/contracts/api/club.dto';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {CreateClubForm} from "@/app/_components/create-club-form";
// A tabela de solicitações pendentes será importada aqui quando construída.
// import { PendingRequestsTable } from './_components/pending-requests-table';

async function getMyClub(accessToken: string): Promise<ClubDto | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/club-management/my-club`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Falha ao buscar dados do seu clube.');
  return res.json();
}

export default function ClubManagementPage() {
  const { data: session } = useSession({ required: true });
  const accessToken = session?.accessToken ?? '';

  const { data: myClub, isLoading, error, isSuccess } = useQuery({
    queryKey: ['my-club'],
    queryFn: () => getMyClub(accessToken),
    enabled: !!accessToken,
    retry: 1,
  });

  if (isLoading) {
    return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro Crítico</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;
  }

  if (isSuccess && !myClub) {
    return <CreateClubForm />;
  }

  if (myClub) {
    return (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="mr-3 h-6 w-6 text-primary"/> Painel de Gestão: {myClub.name}</CardTitle>
              <CardDescription>{myClub.city}, {myClub.state}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader><CardTitle>Solicitações Pendentes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A tabela de solicitações pendentes será implementada aqui.</p>
              {/* <PendingRequestsTable clubId={myClub.id} /> */}
            </CardContent>
          </Card>
        </div>
    );
  }

  return null;
}