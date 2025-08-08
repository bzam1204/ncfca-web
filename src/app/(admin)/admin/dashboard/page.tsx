import { auth } from "@/infraestructure/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/domain/enums/user.roles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardGrid } from "@/app/(admin)/admin/dashboard/_components/stat-card-grid";
import { GrowthCharts } from "@/app/(admin)/admin/dashboard/_components/growth-chars";
import { OperationalHealth } from "@/app/(admin)/admin/dashboard/_components/operational-health";

// Este é o único trabalho da página: autenticar e orquestrar.
export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Visão Geral - Admin</h1>
          <p className="mt-1 text-muted-foreground">
            KPIs e métricas de saúde da plataforma em tempo real.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-28 w-full" />}>
          <StatCardGrid />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <GrowthCharts />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <OperationalHealth />
        </Suspense>
      </div>
  );
}