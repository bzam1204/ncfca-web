
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ListChecks, ShieldPlus} from 'lucide-react';
import Link from "next/link";
import {UserRoles} from "@/domain/enums/user.roles";
import {ExploreClubs} from "@/app/dashboard/clubs/_components/explore-clubs";
import {MyRequestsTable} from "@/app/dashboard/clubs/_components/my-requests-table";
import {auth} from "@/infraestructure/auth";
import {redirect} from "next/navigation";

export default async function ClubsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const isClubDirector = session.user.roles?.includes(UserRoles.DONO_DE_CLUBE);
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
        <ExploreClubs accessToken={session.accessToken} />

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

