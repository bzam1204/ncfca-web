'use client';

import {useState} from 'react';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Dialog, DialogTrigger} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Edit, Users, AlertTriangle, UserCheck} from 'lucide-react';
import {Club} from "@/domain/entities/entities";
import {useAdminClubById} from '@/hooks/use-admin-club-by-id';

import {AdminEditClubForm} from './admin-edit-club-form';
import {ChangePrincipalDialog} from './change-principal-dialog';

export function AdminClubManagementClient({initialClub}: {initialClub: Club}) {
  const {data : club, error, isFetching, refetch} = useAdminClubById(initialClub.id, initialClub);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePrincipalModalOpen, setIsChangePrincipalModalOpen] = useState(false);

  if (isFetching && !club) return <div>Carregando dados do clube...</div>;
  if (error) return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar os dados</AlertTitle>
        <AlertDescription>
          {error.message}
          <Button onClick={() => refetch()} variant="link">Tentar Novamente</Button>
        </AlertDescription>
      </Alert>
  );
  if (!club) return <div>Clube não encontrado.</div>;

  return (
      <>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.address.city}, {club.address.state}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Button variant="outline" size="sm" className="pointer-events-none">
                      <Users className="mr-2 h-4 w-4" />
                      Membros: {club.corum}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsChangePrincipalModalOpen(true)}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Mudar Diretor
                      </Button>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Editar Clube</Button>
                      </DialogTrigger>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="members">Membros</TabsTrigger>
                <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div>Painel de Visão Geral do Clube para Admin.</div>
              </TabsContent>
              <TabsContent value="members" className="mt-6">
                <div>Tabela de Membros.</div>
              </TabsContent>
              <TabsContent value="enrollments" className="mt-6">
                <div>Tabela de Matrículas.</div>
              </TabsContent>
            </Tabs>
          </div>
          <AdminEditClubForm club={club} onSuccess={() => setIsEditModalOpen(false)} />
        </Dialog>

        <ChangePrincipalDialog
            isOpen={isChangePrincipalModalOpen}
            club={club}
            onClose={() => setIsChangePrincipalModalOpen(false)}
        />
      </>
  );
}
