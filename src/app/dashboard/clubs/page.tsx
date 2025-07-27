'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {ClubDto} from '@/contracts/api/club.dto';
import {DependantResponseDto} from '@/contracts/api/dependant.dto';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ListChecks, ShieldPlus} from 'lucide-react';
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

async function getDependants(accessToken: string): Promise<DependantResponseDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dependants`, {
    headers : {'Authorization' : `Bearer ${accessToken}`}
  });
  if (!res.ok) throw new Error('Falha ao carregar seus dependentes.');
  return res.json();
}
