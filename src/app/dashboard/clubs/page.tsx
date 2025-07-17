// src/app/dashboard/clubs/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ClubDto, PaginatedClubDto } from '@/contracts/api/club.dto';
import { DependantResponseDto } from '@/contracts/api/dependant.dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, University } from 'lucide-react';
import {EnrollmentDialog} from "@/app/_components/enrollment-dialog";

// Função de busca de dados para Clubes
async function getClubs(accessToken: string): Promise<PaginatedClubDto> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/club`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Falha ao carregar a lista de clubes.');
  return res.json();
}

// Função de busca de dados para Dependentes
async function getDependants(accessToken: string): Promise<DependantResponseDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dependants`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Falha ao carregar seus dependentes.');
  return res.json();
}

export default function ClubsPage() {
  const [selectedClub, setSelectedClub] = useState<ClubDto | null>(null);
  const { data: session } = useSession({ required: true });
  const accessToken = session?.accessToken ?? '';

  // Query para buscar os clubes
  const { data: clubsResponse, isLoading: isLoadingClubs, error: errorClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => getClubs(accessToken),
    enabled: !!accessToken,
  });

  // Query para buscar os dependentes (necessário para o modal)
  const { data: dependants = [], isLoading: isLoadingDependants, error: errorDependants } = useQuery({
    queryKey: ['dependants'],
    queryFn: () => getDependants(accessToken),
    enabled: !!accessToken,
  });

  const isLoading = isLoadingClubs || isLoadingDependants;
  const queryError = errorClubs || errorDependants;

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
    </div>
  }

  if (queryError) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro ao Carregar Dados</AlertTitle>
      <AlertDescription>{queryError.message}</AlertDescription>
    </Alert>
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clubes</h1>
          <p className="text-muted-foreground">Explore os clubes disponíveis e solicite a matrícula para seus dependentes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubsResponse?.data.map(club => (
              <Card key={club.id} className="flex flex-col">
                <CardHeader>
                  <University className="mb-2 h-8 w-8 text-muted-foreground"/>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>{club.city}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" onClick={() => setSelectedClub(club)}>
                    Solicitar Matrícula
                  </Button>
                </CardContent>
              </Card>
          ))}
        </div>

        {clubsResponse?.data.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Nenhum Clube Encontrado</AlertTitle>
              <AlertDescription>No momento, não há clubes disponíveis para matrícula.</AlertDescription>
            </Alert>
        )}

        <EnrollmentDialog
            club={selectedClub}
            dependants={dependants}
            isOpen={!!selectedClub}
            onClose={() => setSelectedClub(null)}
        />
      </div>
  );
}
