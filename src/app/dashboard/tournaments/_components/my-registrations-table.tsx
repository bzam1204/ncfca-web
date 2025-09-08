'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Filter, Search, RotateCcw } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { RegistrationStatus, SearchMyRegistrationItemView } from '@/contracts/api/registration.dto';

import { useCancelRegistration } from '@/hooks/use-cancel-registration';
import { useMyRegistrations } from '@/hooks/use-my-registrations';
import { useDebounce } from '@/hooks/use-debounce';

export function MyRegistrationsTable() {
  const [tournamentName, setTournamentName] = useState('');
  const [status, setStatus] = useState<RegistrationStatus | ''>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedName = useDebounce(tournamentName, 400);

  const { isLoading, isRefetching, error, registrations, meta } = useMyRegistrations({
    tournamentName: debouncedName || undefined,
    status: (status as RegistrationStatus) || undefined,
    order,
    page,
    limit,
  });
  const cancelMutation = useCancelRegistration();

  const rows = useMemo(() => registrations ?? [], [registrations]);
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={tournamentName}
              onChange={(e) => {
                setTournamentName(e.target.value);
                setPage(1);
              }}
              className="pl-8 w-64"
              placeholder="Nome do torneio..."
            />
          </div>
          <Select
            value={status || 'ALL'}
            onValueChange={(val) => {
              setStatus(val === 'ALL' ? '' : (val as RegistrationStatus));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmada</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Aguardando Aprovação</SelectItem>
              <SelectItem value="REJECTED">Rejeitada</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={order}
            onValueChange={(val) => {
              setOrder(val as 'asc' | 'desc');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mais recentes</SelectItem>
              <SelectItem value="asc">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Inscrições</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md relative">
        {isRefetching && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <div className="bg-background border rounded-md p-2 shadow-sm">
              <RotateCcw className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        {isLoading && rows.length === 0 ? (
          <Skeleton className="h-40 w-full" />
        ) : (
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
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          if (p >= 1 && p <= totalPages) setPage(p);
        }}
      />
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
