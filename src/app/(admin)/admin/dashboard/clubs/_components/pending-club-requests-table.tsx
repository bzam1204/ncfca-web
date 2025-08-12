'use client';

import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { usePendingClubRequests } from "@/hooks/use-pending-club-requests";
import { ClubRequestActions } from "./club-request-actions";

interface PendingClubRequestsTableProps {
  initialRequests: ClubRequestStatusDto[];
  onDataChange: (data: ClubRequestStatusDto[]) => void;
}

export function PendingClubRequestsTable({ initialRequests, onDataChange }: PendingClubRequestsTableProps) {
  // O componente agora consome o hook dedicado.
  const { data: requests, isLoading, isError, error, refetch, isRefetching } = usePendingClubRequests(initialRequests);

  // Notifica o componente pai sobre a mudança nos dados para atualizar o badge
  useEffect(() => {
    onDataChange(requests);
  }, [requests, onDataChange]);

  if (isLoading && !isRefetching) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  if (isError) {
    return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Solicitações</AlertTitle>
          <AlertDescription>
            {error.message}
            <Button variant="link" onClick={() => refetch()}>Tentar Novamente</Button>
          </AlertDescription>
        </Alert>
    );
  }

  return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>Aprove ou rejeite as solicitações para criação de novos clubes.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
              <RotateCcw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Clube Proposto</TableHead>
                  <TableHead>Localidade</TableHead>
                  <TableHead>Data da Solicitação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                    requests.map(req => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.clubName}</TableCell>
                          <TableCell>{(req as any).address?.city || 'N/A'}, {(req as any).address?.state || 'N/A'}</TableCell>
                          <TableCell>{new Date(req.requestedAt).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <ClubRequestActions requestId={req.id} />
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">Nenhuma solicitação pendente no momento.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}