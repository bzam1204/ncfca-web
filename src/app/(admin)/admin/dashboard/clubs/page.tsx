import {auth} from "@/infrastructure/auth";
import {redirect} from "next/navigation";
import {UserRoles} from "@/domain/enums/user.roles";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {ClubsPageClient} from "./_components/clubs-page-client";

import {getPendingClubRequestsAction} from "@/infrastructure/actions/admin/get-pending-club-requests.action";

export default async function AdminClubsPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }
  return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Gerenciamento de Clubes</h1>
          <p className="text-muted-foreground">
            Gerencie solicitações de novos clubes e visualize os clubes existentes.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ClubsPageLoader />
        </Suspense>
      </div>
  );
}

async function ClubsPageLoader() {
  const pendingRequests = await getPendingClubRequestsAction();
  return <ClubsPageClient initialPendingRequests={pendingRequests} />;
}