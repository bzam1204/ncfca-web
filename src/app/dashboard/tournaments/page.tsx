import { redirect } from 'next/navigation';
import { ListChecks, Search } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { auth } from '@/infrastructure/auth';

import { FeaturedTournamentsCarousel } from '@/app/dashboard/tournaments/_components/featured-tournaments-carousel';
import { MyRegistrationsTable } from '@/app/dashboard/tournaments/_components/my-registrations-table';
import { ExploreTournaments } from '@/app/dashboard/tournaments/_components/explore-tournaments';

export default async function TournamentsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-8">
      <Tabs defaultValue="explore" className="w-full">
        <TabsList>
          <TabsTrigger value="explore" className="gap-2">
            <Search className="h-4 w-4" /> Explorar Torneios
          </TabsTrigger>
          <TabsTrigger value="my" className="gap-2">
            <ListChecks className="h-4 w-4" /> Minhas Inscrições
          </TabsTrigger>
        </TabsList>
        <TabsContent value="explore" className="mt-4 space-y-6">
          <FeaturedTournamentsCarousel />
          <ExploreTournaments />
        </TabsContent>
        <TabsContent value="my" className="mt-4">
          <Card className="max-w-screen">
            <CardHeader>
              <CardTitle className="flex items-center">Minhas Inscrições em Torneios</CardTitle>
              <CardDescription>Acompanhe o status das suas inscrições em torneios.</CardDescription>
            </CardHeader>
            <CardContent className="max-w-screen">
              <MyRegistrationsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Featured section is now owned by the carousel component to avoid rendering when empty.
