'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { AlertTriangle, Search, University } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { SearchClubsQuery } from '@/contracts/api/club.dto';

import { useSearchClubs } from '@/hooks/use-search-clubs';
import { useDebounce } from '@/hooks/use-debounce';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { EnrollmentDialog } from '@/app/dashboard/clubs/_components/enrollment-dialog';
import { Club } from '@/domain/entities/entities';

export function ExploreClubs() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState<SearchClubsQuery>(initialQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const query = { ...debouncedSearchQuery, page: searchQuery.page };
  const session = useSession();
  const clubQuery = useSearchClubs(query);
  const clubs = clubQuery.data?.data ?? [];
  if (!session.data?.accessToken) return <Skeleton className="flex items-center justify-center h-screen"></Skeleton>;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-3 h-6 w-6" /> Buscar Clubes
        </CardTitle>
        <CardDescription>Encontre clubes por nome, cidade ou estado.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input placeholder="Nome do clube..." name="name" value={searchQuery.name} onChange={(e) => handleSearchChange(e, setSearchQuery)} />
          <Input placeholder="Cidade..." name="city" value={searchQuery.city} onChange={(e) => handleSearchChange(e, setSearchQuery)} />
          <Input placeholder="Estado (UF)..." name="state" value={searchQuery.state} onChange={(e) => handleSearchChange(e, setSearchQuery)} />
        </div>
        {clubQuery.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        )}
        {clubQuery.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao Buscar Clubes</AlertTitle>
            <AlertDescription>{clubQuery.error.message}</AlertDescription>
          </Alert>
        )}
        {!clubQuery.isLoading && !clubQuery.error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club: Club) => (
                <Card key={club.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <University className="mb-2 h-8 w-8 text-muted-foreground" />
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>
                      {club.address.city}, {club.address.state}
                    </CardDescription>
                    <Badge variant="secondary">
                      {club.corum} / {club.maxMembers || '∞'} membros
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => setSelectedClub(club)}
                      disabled={club.maxMembers !== null && club.maxMembers !== undefined && club.corum >= club.maxMembers}
                    >
                      {club.maxMembers !== null && club.maxMembers !== undefined && club.corum >= club.maxMembers
                        ? 'Clube Cheio'
                        : 'Solicitar Matrícula'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {clubs.length === 0 && (
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhum Clube Encontrado</AlertTitle>
                <AlertDescription>Nenhum clube corresponde à sua busca. Tente outros termos.</AlertDescription>
              </Alert>
            )}
            <PaginationControls
              currentPage={searchQuery.page || 1}
              totalPages={clubQuery.data?.meta.totalPages || 1}
              onPageChange={(page) => handlePageChange(page, clubQuery.data!.meta.totalPages, setSearchQuery)}
            />
          </>
        )}
      </CardContent>
      <EnrollmentDialog club={selectedClub} isOpen={!!selectedClub} onClose={() => setSelectedClub(null)} />
    </Card>
  );
}

const initialQuery: SearchClubsQuery = {
  name: '',
  city: '',
  state: '',
  page: 1,
  limit: 6,
};

function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>, setClubsQuery: Dispatch<SetStateAction<SearchClubsQuery>>) {
  setClubsQuery((prev) => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
}

const handlePageChange = (newPage: number, totalPages: number, setClubsQuery: Dispatch<SetStateAction<SearchClubsQuery>>) => {
  if (newPage > 0 && newPage <= (totalPages || 1)) {
    setClubsQuery((prev) => ({ ...prev, page: newPage }));
  }
};
