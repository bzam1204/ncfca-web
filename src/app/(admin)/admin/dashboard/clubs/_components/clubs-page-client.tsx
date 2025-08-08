import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {ClubRequestStatusDto} from "@/contracts/api/club-management.dto";
import {ClubsTable} from "@/app/(admin)/admin/dashboard/clubs/_components/clubs-table";
import {PendingClubRequestsTable} from "./pending-club-requests-table";
import {Club, User} from "@/domain/entities/entities";

interface ClubsPageClientProps {
  initialClubs: Club[];
  initialUsers: User[];
  initialPendingRequests: ClubRequestStatusDto[];
}

export function ClubsPageClient({
                                  initialClubs,
                                  initialUsers,
                                  initialPendingRequests,
                                }: ClubsPageClientProps) {
  const pendingCount = initialPendingRequests.length;

  return (
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">
            Solicitações
            {pendingCount > 0 && (<Badge variant="destructive" className="ml-2 rounded-4xl w-fit text-[0.7rem]  py-0">{pendingCount}</Badge>)}
          </TabsTrigger>
          <TabsTrigger value="all_clubs">Gerenciar Clubes</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="mt-6">
          <PendingClubRequestsTable requests={initialPendingRequests} />
        </TabsContent>
        <TabsContent value="all_clubs" className="mt-6">
          <ClubsTable initialClubs={initialClubs} allUsers={initialUsers} />
        </TabsContent>
      </Tabs>
  );
}