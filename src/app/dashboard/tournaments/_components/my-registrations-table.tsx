'use client';

import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { RegistrationStatus, SearchMyRegistrationItemView } from '@/contracts/api/registration.dto';

import { useMyRegistrations } from '@/hooks/use-my-registrations';
import { useCancelRegistration } from '@/hooks/use-cancel-registration';

export function MyRegistrationsTable() {
  const { isLoading, error, registrations } = useMyRegistrations();
  const cancelMutation = useCancelRegistration();

  const rows = useMemo(() => registrations ?? [], [registrations]);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Inscrições</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-md max-h-[420px] overflow-y-auto scrollbar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Torneio</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((r: SearchMyRegistrationItemView) => (
              <TableRow key={r.registrationId}>
                <TableCell className="font-medium">{r.tournamentName}</TableCell>
                <TableCell>{r.tournamentType}</TableCell>
                <TableCell>
                  <Badge variant={getRegistrationStatusVariant(r.status)}>{translateRegistrationStatus(r.status)}</Badge>
                </TableCell>
                <TableCell>{formatDateTime(r.requestedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelMutation.mutate({ registrationId: r.registrationId })}
                    disabled={!canCancel(r.status) || cancelMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Você ainda não possui inscrições em torneios.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function canCancel(status: RegistrationStatus) {
  return status !== 'CANCELLED' && status !== 'REJECTED';
}

function translateRegistrationStatus(status: RegistrationStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmada';
    case 'CANCELLED':
      return 'Cancelada';
    case 'PENDING_APPROVAL':
      return 'Aguardando Aprovação';
    case 'REJECTED':
      return 'Rejeitada';
    default:
      return status;
  }
}

function getRegistrationStatusVariant(status: RegistrationStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'default' as const;
    case 'REJECTED':
    case 'CANCELLED':
      return 'destructive' as const;
    case 'PENDING_APPROVAL':
    default:
      return 'secondary' as const;
  }
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString();
}

