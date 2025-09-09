'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Trophy, Trash2, Search, CalendarDays, Users } from 'lucide-react';

import { useDebounce } from '@/hooks/misc/use-debounce';
import { useSearchTournaments } from '@/hooks/tournaments/use-search-tournaments';
import { useDeleteTournament } from '@/hooks/tournaments/use-delete-tournament';

import { SearchTournamentsItemView, SearchTournamentsQuery, TournamentType } from '@/contracts/api/tournament.dto';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { EditTournamentDialog } from '@/app/(admin)/admin/dashboard/tournaments/_components/edit-tournament-dialog';

export function TournamentsList() {
  const [query, setQuery] = useState<SearchTournamentsQuery>(initialQuery);
  const debounced = useDebounce(query, 400);
  const effectiveQuery = useMemo(
    () => ({ ...debounced, pagination: { ...debounced.pagination, page: query.pagination?.page || 1 } }),
    [debounced, query.pagination?.page],
  );
  const { tournaments, meta, isLoading, error } = useSearchTournaments(effectiveQuery);
  const deleteMutation = useDeleteTournament();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-3 h-6 w-6" /> Buscar/Administrar Torneios
        </CardTitle>
        <CardDescription>Filtre por nome, tipo e inscrições abertas; edite ou remova.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input placeholder="Nome do torneio..." value={query.filter?.name || ''} onChange={(e) => handleNameChange(e, setQuery)} />
          <Select value={(query.filter?.type as string) ?? 'ALL'} onValueChange={(val) => handleTypeChange(val, setQuery)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="DUO">Dupla</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 px-2 py-2 rounded-md border border-input">
            <Checkbox checked={!!query.filter?.openedRegistration} onCheckedChange={(checked) => handleOpenedRegistrationChange(!!checked, setQuery)} />
            <span className="text-sm">Inscrições abertas</span>
          </label>
        </div>

        {isLoading && <Fallback />}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            {tournaments.length === 0 ? (
              <Alert>
                <Trophy className="h-4 w-4" />
                <AlertTitle>Nenhum Torneio Cadastrado</AlertTitle>
                <AlertDescription>Ajuste os filtros ou crie um novo torneio.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {tournaments.map((t: SearchTournamentsItemView) => (
                  <Card key={t.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Trophy className="mr-2 h-5 w-5 text-primary" />
                          {t.name}
                        </span>
                        <div className="flex gap-1">
                          <EditTournamentDialog id={t.id} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o torneio &quot;{t.name}&quot;? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(t.id)} disabled={deleteMutation.isPending}>
                                  {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <CardDescription className="flex gap-2 items-center">
                        <Badge variant="secondary">{t.type}</Badge>
                        <span className="flex items-center gap-1 text-sm"><CalendarDays className="h-4 w-4" /> {formatDate(t.startDate)}</span>
                        <span className="flex items-center gap-1 text-sm"><Users className="h-4 w-4" /> {t.registrationCount}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1" />
                  </Card>
                ))}
              </div>
            )}
            <PaginationControls
              currentPage={query.pagination?.page || 1}
              totalPages={meta?.totalPages || 1}
              onPageChange={(page) => handlePageChange(page, meta?.totalPages || 1, setQuery)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Fallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

const initialQuery: SearchTournamentsQuery = {
  filter: {
    name: '',
    type: undefined,
    openedRegistration: undefined,
  },
  pagination: {
    page: 1,
    limit: 6,
  },
};

function handleNameChange(e: React.ChangeEvent<HTMLInputElement>, setQuery: Dispatch<SetStateAction<SearchTournamentsQuery>>) {
  const name = e.target.value;
  setQuery((prev) => ({
    ...prev,
    filter: { ...(prev.filter || {}), name },
    pagination: { ...(prev.pagination || {}), page: 1 },
  }));
}

function handleTypeChange(val: string, setQuery: Dispatch<SetStateAction<SearchTournamentsQuery>>) {
  const type = (val === 'ALL' ? undefined : (val as TournamentType)) as TournamentType | undefined;
  setQuery((prev) => ({
    ...prev,
    filter: { ...(prev.filter || {}), type },
    pagination: { ...(prev.pagination || {}), page: 1 },
  }));
}

function handleOpenedRegistrationChange(checked: boolean, setQuery: Dispatch<SetStateAction<SearchTournamentsQuery>>) {
  const openedRegistration = checked ? true : undefined;
  setQuery((prev) => ({
    ...prev,
    filter: { ...(prev.filter || {}), openedRegistration },
    pagination: { ...(prev.pagination || {}), page: 1 },
  }));
}

const handlePageChange = (newPage: number, totalPages: number, setQuery: Dispatch<SetStateAction<SearchTournamentsQuery>>) => {
  if (newPage > 0 && newPage <= (totalPages || 1)) {
    setQuery((prev) => ({ ...prev, pagination: { ...(prev.pagination || {}), page: newPage } }));
  }
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
