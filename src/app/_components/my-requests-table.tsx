// src/app/_components/my-requests-table.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { EnrollmentRequestDto } from "@/contracts/api/enrollment.dto";
import { ClubDto } from "@/contracts/api/club.dto";
import { DependantResponseDto } from "@/contracts/api/dependant.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Eye } from "lucide-react";
import { enrollmentStatusTranslation, getEnrollmentStatusVariant } from "@/lib/translations";
import { Button } from '@/components/ui/button';
import { RequestDetailsDialog } from './request-details-dialog';

// Funções de Data Fetching
async function getMyEnrollmentRequests(token: string): Promise<EnrollmentRequestDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/enrollments/my-requests`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Falha ao carregar suas solicitações.');
  return res.json();
}

async function getAllClubs(token: string): Promise<ClubDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/club`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Falha ao carregar lista de clubes.');
  // A API de clubes é paginada, mas para a junção de dados aqui, buscamos a primeira página.
  // Uma API mais robusta retornaria todos ou permitiria uma busca por IDs.
  const paginatedResponse = await res.json();
  return paginatedResponse.data;
}

async function getDependants(token: string): Promise<DependantResponseDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dependants`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Falha ao carregar seus dependentes.');
  return res.json();
}


export function MyRequestsTable() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequestDto | null>(null);

  const { data: requests = [], isLoading: isLoadingRequests, error: errorRequests } = useQuery({
    queryKey: ['my-enrollment-requests'],
    queryFn: () => getMyEnrollmentRequests(accessToken),
    enabled: !!accessToken,
  });

  const { data: clubs = [], isLoading: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => getAllClubs(accessToken),
    enabled: !!accessToken,
  });

  const { data: dependants = [], isLoading: isLoadingDependants } = useQuery({
    queryKey: ['dependants'],
    queryFn: () => getDependants(accessToken),
    enabled: !!accessToken,
  });

  const isLoading = isLoadingRequests || isLoadingClubs || isLoadingDependants;

  const getClub = (clubId: string) => clubs.find(c => c.id === clubId) || null;
  const getDependant = (depId: string) => dependants.find(d => d.id === depId) || null;

  const selectedRequestData = {
    request: selectedRequest,
    club: selectedRequest ? getClub(selectedRequest.clubId) : null,
    dependant: selectedRequest ? getDependant(selectedRequest.dependantId) : null,
  }

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (errorRequests) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro ao Carregar Solicitações</AlertTitle>
      <AlertDescription>{errorRequests.message}</AlertDescription>
    </Alert>;
  }

  return (
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clube</TableHead>
                <TableHead>Dependente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                  requests.map(req => (
                      <TableRow key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer">
                        <TableCell className="font-medium">{getClub(req.clubId)?.name || '...'}</TableCell>
                        <TableCell>{getDependant(req.dependantId)?.firstName || '...'}</TableCell>
                        <TableCell>
                          <Badge variant={getEnrollmentStatusVariant(req.status)}>
                            {enrollmentStatusTranslation[req.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                            <Eye className="mr-2 h-4 w-4"/>
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Você ainda não fez nenhuma solicitação de matrícula.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <RequestDetailsDialog
            request={selectedRequestData.request}
            club={selectedRequestData.club}
            dependant={selectedRequestData.dependant}
            onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}
        />
      </>
  );
}
