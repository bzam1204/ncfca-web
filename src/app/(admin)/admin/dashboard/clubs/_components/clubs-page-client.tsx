'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";

import {ClubRequestStatusDto} from "@/contracts/api/club-management.dto";
import {usePendingClubRequests} from "@/hooks/use-pending-club-requests";

import {PendingClubRequestsTable} from "./pending-club-requests-table";
import {AdminClubsTable} from './admin-clubs-table';

export function ClubsPageClient({initialPendingRequests}: ClubsPageClientProps) {
  // Use React Query hook directly to get real-time pending count
  const { data: pendingRequests } = usePendingClubRequests(initialPendingRequests);
  const pendingCount = pendingRequests?.length || 0;
  return (
      <Tabs defaultValue="all_clubs">
        <TabsList>
          <TabsTrigger value="all_clubs">Gerenciar Clubes</TabsTrigger>
          <TabsTrigger value="requests">
            Solicitações
            {pendingCount > 0 && (<Badge variant="destructive" className="ml-2">{pendingCount}</Badge>)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all_clubs" className="mt-6">
          <AdminClubsTable />
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <PendingClubRequestsTable
              initialRequests={initialPendingRequests}
          />
        </TabsContent>
      </Tabs>
  );
}

interface ClubsPageClientProps {
  initialPendingRequests: ClubRequestStatusDto[];
}
