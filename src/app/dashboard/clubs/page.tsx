// src/app/dashboard/clubs/page.tsx
'use client';

import {useState, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {useDebounce} from '@/hooks/use-debounce';
import {ClubDto, PaginatedClubDto, SearchClubsQuery} from '@/contracts/api/club.dto';
import {DependantResponseDto} from '@/contracts/api/dependant.dto';
import {EnrollmentRequestDto} from '@/contracts/api/enrollment.dto';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {Input} from '@/components/ui/input';
import {AlertTriangle, University, Search, ListChecks, ShieldPlus} from 'lucide-react';
import {PaginationControls} from '@/components/ui/pagination-controls';
import {MyRequestsTable} from "@/app/_components/my-requests-table";
import {EnrollmentDialog} from "@/app/_components/enrollment-dialog";
import Link from "next/link";
import {UserRoles} from "@/domain/enums/user.roles";

const NonDirectorCallToAction = () => (

    <Card className="bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center"><ShieldPlus
            className="mr-3 h-6 w-6 text-primary" /> Torne-se um Diretor de Clube</CardTitle>
        <CardDescription>
          Lidere, mentore e construa uma comunidade de debate. Crie seu próprio clube
          e comece a gerenciar matrículas e membros hoje mesmo.
        </CardDescription>
        <div className="pt-4">
          <Button asChild>
            <Link href="/dashboard/club-management">Criar Meu Clube</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
);

// --- Funções de Busca de Dados ---
async function getClubs(accessToken: string, query: SearchClubsQuery): Promise<PaginatedClubDto> {
  const params = new URLSearchParams();
  if (query.name) params.append('filter[name]', query.name);
  if (query.city) params.append('filter[city]', query.city);
  if (query.state) params.append('filter[state]', query.state);
  params.append('pagination[page]', query.page?.toString() || '1');
  params.append('pagination[limit]', query.limit?.toString() || '6');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/club?${params.toString()}`, {
    headers : {'Authorization' : `Bearer ${accessToken}`}
  });
  if (!res.ok) throw new Error('Falha ao buscar clubes.');
  return res.json();
}

async function getDependants(accessToken: string): Promise<DependantResponseDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dependants`, {
    headers : {'Authorization' : `Bearer ${accessToken}`}
  });
  if (!res.ok) throw new Error('Falha ao carregar seus dependentes.');
  return res.json();
}

async function getMyEnrollmentRequests(accessToken: string): Promise<EnrollmentRequestDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/enrollments/my-requests`, {
    headers : {'Authorization' : `Bearer ${accessToken}`}
  });
  if (!res.ok) throw new Error('Falha ao carregar suas solicitações de matrícula.');
  return res.json();
}

export default function ClubsPage() {
  const {data : session} = useSession({required : true});
  const isClubDirector = session?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE);
  const [selectedClub, setSelectedClub] = useState<ClubDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<SearchClubsQuery>({
    name : '',
    city : '',
    state : '',
    page : 1,
    limit : 6
  });
  const debouncedSearchQuery = useDebounce({...searchQuery, page : 1}, 500);
  const paginatedQuery = {...debouncedSearchQuery, page : searchQuery.page};
  const accessToken = session?.accessToken ?? '';
  const {data : clubsResponse, isLoading : isLoadingClubs, error : errorClubs} = useQuery({
    queryKey : ['clubs', paginatedQuery],
    queryFn : () => getClubs(accessToken, paginatedQuery),
    enabled : !!accessToken,
    placeholderData : (previousData) => previousData,
  });
  const {data : dependants = []} = useQuery({
    queryKey : ['dependants'],
    queryFn : () => getDependants(accessToken),
    enabled : !!accessToken
  });
  const {data : enrollmentRequests = []} = useQuery({
    queryKey : ['my-enrollment-requests'],
    queryFn : () => getMyEnrollmentRequests(accessToken),
    enabled : !!accessToken
  });
  const queryError = errorClubs; // Focando no erro principal da busca de clubes para a UI
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(prev => ({...prev, [e.target.name] : e.target.value, page : 1}));
  };
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (clubsResponse?.meta.totalPages || 1)) {
      setSearchQuery(prev => ({...prev, page : newPage}));
    }
  };
  const requestedClubIds = useMemo(() => new Set(enrollmentRequests.map(req => req.clubId)), [enrollmentRequests]);
  return (

      <div className="space-y-8">
        {!isClubDirector && <NonDirectorCallToAction />}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks
                className="mr-3 h-6 w-6" /> Minhas Solicitações</CardTitle>
            <CardDescription>Acompanhe o status das suas solicitações de matrícula.</CardDescription>
          </CardHeader>
          <CardContent>
            <MyRequestsTable
                requests={enrollmentRequests}
                clubs={clubsResponse?.data || []}
                dependants={dependants}
                isLoading={false}
                error={null}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Search className="mr-3 h-6 w-6" /> Buscar Clubes</CardTitle>
            <CardDescription>Encontre clubes por nome, cidade ou estado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input placeholder="Nome do clube..." name="name" value={searchQuery.name}
                     onChange={handleSearchChange} />
              <Input placeholder="Cidade..." name="city" value={searchQuery.city} onChange={handleSearchChange} />
              <Input placeholder="Estado (UF)..." name="state" value={searchQuery.state}
                     onChange={handleSearchChange} />
            </div>
            {isLoadingClubs && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>}
            {queryError && <Alert variant="destructive"><AlertTriangle
                className="h-4 w-4" /><AlertTitle>Erro ao Buscar Clubes</AlertTitle><AlertDescription>{queryError.message}</AlertDescription></Alert>}
            {!isLoadingClubs && !queryError && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubsResponse?.data.map((club: ClubDto) => ( // Tipagem explícita
                        <Card key={club.id} className="flex flex-col justify-between">
                          <CardHeader>
                            <University className="mb-2 h-8 w-8 text-muted-foreground" />
                            <CardTitle>{club.name}</CardTitle>
                            <CardDescription>{club.city}, {club.state}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full" onClick={() => setSelectedClub(club)}>
                              Solicitar Matrícula
                            </Button>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                  {clubsResponse?.data.length === 0 && (
                      <Alert className="mt-6"><AlertTriangle
                          className="h-4 w-4" /><AlertTitle>Nenhum Clube Encontrado</AlertTitle><AlertDescription>Nenhum clube corresponde à sua busca. Tente outros termos.</AlertDescription></Alert>
                  )}
                  <PaginationControls
                      currentPage={searchQuery.page || 1}
                      totalPages={clubsResponse?.meta.totalPages || 1}
                      onPageChange={handlePageChange}
                  />
                </>
            )}
          </CardContent>
        </Card>
        <EnrollmentDialog
            club={selectedClub}
            dependants={dependants}
            isOpen={!!selectedClub}
            onClose={() => setSelectedClub(null)}
        />
      </div>
  );
}
