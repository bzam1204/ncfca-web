'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchClubs } from '@/hooks/use-search-clubs';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchClubsQuery } from '@/contracts/api/club.dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { AlertTriangle, Search } from 'lucide-react';

const initialQuery: Omit<SearchClubsQuery, 'limit'> = {
  name: '',
  city: '',
  state: '',
  page: 1,
};

export function AdminClubsTable() {
  const [filters, setFilters] = useState(initialQuery);
  const debouncedFilters = useDebounce({ name: filters.name, city: filters.city, state: filters.state }, 500);

  const query: SearchClubsQuery = {
    ...debouncedFilters,
    page: filters.page,
    limit: 10,
  };

  const { data: paginatedData, isLoading, error, isFetching } = useSearchClubs(query);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Todos os Clubes</CardTitle>
          <CardDescription>Busque, filtre e gerencie todos os clubes da plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome do clube..." name="name" value={filters.name} onChange={handleFilterChange} className="pl-10" />
            </div>
            <Input placeholder="Filtrar por cidade..." name="city" value={filters.city} onChange={handleFilterChange} />
            <Input placeholder="Filtrar por estado (UF)..." name="state" value={filters.state} onChange={handleFilterChange} />
          </div>

          {/* Tabela de Dados */}
          <div className="border rounded-md">
            {error && (
                <Alert variant="destructive" className="m-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erro ao Carregar Clubes</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Clube</TableHead>
                  <TableHead>Localidade</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Data de Criação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading || isFetching) ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell>
                        </TableRow>
                    ))
                ) : paginatedData?.data && paginatedData.data.length > 0 ? (
                    paginatedData.data.map(club => (
                        <TableRow key={club.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link href={`/admin/dashboard/clubs/${club.id}`} className="hover:underline">
                              {club.name}
                            </Link>
                          </TableCell>
                          <TableCell>{club.address.city}, {club.address.state}</TableCell>
                          <TableCell>{club.corum}</TableCell>
                          <TableCell>{new Date(club.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">Nenhum clube encontrado.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {paginatedData?.meta && paginatedData.meta.totalPages > 1 && (
              <PaginationControls
                  currentPage={filters.page!}
                  totalPages={paginatedData.meta.totalPages}
                  onPageChange={handlePageChange}
              />
          )}
        </CardContent>
      </Card>
  );
}
