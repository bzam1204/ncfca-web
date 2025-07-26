'use client';

import {useState} from 'react';
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
import Link from "next/link";
import {UserRoles} from "@/domain/enums/user.roles";
import {EnrollmentDialog} from "@/app/dashboard/clubs/_components/enrollment-dialog";
import {ExploreClubs} from "@/app/dashboard/clubs/_components/explore-clubs";

export default function ClubsPage() {
  const {data : session} = useSession({required : true});
  const isClubDirector = session?.user?.roles?.includes(UserRoles.DONO_DE_CLUBE);
  const [selectedClub, setSelectedClub] = useState<ClubDto | null>(null);

  const accessToken = session?.accessToken ?? '';

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

  return (
      <div className="space-y-8">
        {!isClubDirector && <NonDirectorCallToAction />}
        <Card className="max-w-screen">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks
                className="mr-3 h-6 w-6" /> Minhas Solicitações</CardTitle>
            <CardDescription>Acompanhe o status das suas solicitações de matrícula.</CardDescription>
          </CardHeader>
          <CardContent className="max-w-screen">
            <MyRequestsTable />
          </CardContent>
        </Card>
        <ExploreClubs setSelectedClub={setSelectedClub} accessToken={accessToken} />
        <EnrollmentDialog
            club={selectedClub}
            dependants={dependants}
            isOpen={!!selectedClub}
            onClose={() => setSelectedClub(null)}
        />
      </div>
  );
}

function NonDirectorCallToAction() {
  return (
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
}

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
