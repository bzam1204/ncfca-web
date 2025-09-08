'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import Link from 'next/link';

import { AlertTriangle, CalendarDays, Search, Users } from 'lucide-react';

import { SearchTournamentsItemView, SearchTournamentsQuery, TournamentType } from '@/contracts/api/tournament.dto';

import { useSearchTournaments } from '@/hooks/use-search-tournaments';
import { useDebounce } from '@/hooks/use-debounce';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export function ExploreTournaments() {
  const [query, setQuery] = useState<SearchTournamentsQuery>(initialQuery);
  const debounced = useDebounce(query, 400);
  const effectiveQuery = useMemo(() => ({ ...debounced, pagination: { ...debounced.pagination, page: query.pagination?.page || 1 } }), [debounced, query.pagination?.page]);
  const { isLoading, error, tournaments, meta } = useSearchTournaments(effectiveQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-3 h-6 w-6" /> Buscar Torneios
        </CardTitle>
        <CardDescription>Encontre torneios por nome e tipo, e navegue até os detalhes para se inscrever.</CardDescription>
      </CardHeader>
      <CardContent>
        {
          // Opened registration filter (follows API layer standardization)
        }
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
            <Checkbox
              checked={!!query.filter?.openedRegistration}
              onCheckedChange={(checked) => handleOpenedRegistrationChange(!!checked, setQuery)}
            />
            <span className="text-sm">Inscrições abertas</span>
          </label>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao Buscar Torneios</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((t: SearchTournamentsItemView) => (
                <Card key={t.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{t.name}</CardTitle>
                    <CardDescription className="flex gap-2 items-center">
                      <Badge variant="secondary">{t.type}</Badge>
                      <span className="flex items-center gap-1 text-sm"><CalendarDays className="h-4 w-4" /> {formatDate(t.startDate)}</span>
                      <span className="flex items-center gap-1 text-sm"><Users className="h-4 w-4" /> {t.registrationCount}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full cursor-pointer">
                      <Link href={`/dashboard/tournaments/${t.id}`}>Ver detalhes</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {tournaments.length === 0 && (
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhum Torneio Encontrado</AlertTitle>
                <AlertDescription>Nenhum torneio corresponde à sua busca. Tente outros termos.</AlertDescription>
              </Alert>
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
