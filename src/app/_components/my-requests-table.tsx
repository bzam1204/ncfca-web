// src/app/dashboard/clubs/_components/my-requests-table.tsx
'use client';

import {EnrollmentRequestDto} from "@/contracts/api/enrollment.dto";
import {ClubDto} from "@/contracts/api/club.dto";
import {DependantResponseDto} from "@/contracts/api/dependant.dto";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle} from "lucide-react";
import {enrollmentStatusTranslation, getEnrollmentStatusVariant} from "@/lib/translations";

interface MyRequestsTableProps {
  requests: EnrollmentRequestDto[];
  clubs: ClubDto[];
  dependants: DependantResponseDto[];
  isLoading: boolean;
  error: Error | null;
}

export function MyRequestsTable({requests, clubs, dependants, isLoading, error}: MyRequestsTableProps) {
  if (isLoading) {
    return <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>;
  }

  if (error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro ao Carregar Solicitações</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>;
  }

  const getClubName = (clubId: string) => clubs.find(c => c.id === clubId)?.name || 'Clube não encontrado';
  const getDependantName = (depId: string) => {
    const dep = dependants.find(d => d.id === depId);
    return dep ? `${dep.firstName} ${dep.lastName}` : 'Dependente não encontrado';
  };

  return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clube</TableHead>
              <TableHead>Dependente</TableHead>
              <TableHead className="hidden md:table-cell">Data da Solicitação</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
                requests.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{getClubName(req.clubId)}</TableCell>
                      <TableCell>{getDependantName(req.dependantId)}</TableCell>
                      <TableCell
                          className="hidden md:table-cell">{new Date(req.requestedAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getEnrollmentStatusVariant(req.status)} className="text-xs">
                          {enrollmentStatusTranslation[req.status]}
                        </Badge>
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
  );
}
