import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/domain/enums/user.roles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FamilyResponseDto } from "@/contracts/api/family.dto";
import { ClubDto } from "@/contracts/api/club.dto";
import { EnrollmentRequestDto } from "@/contracts/api/enrollment.dto";
import { UserDto } from "@/contracts/api/user.dto";
import { FamilyStatus } from "@/domain/enums/family-status.enum";
import { EnrollmentStatus } from "@/domain/enums/enrollment-status.enum";
import {StatCardGrid} from "@/app/(admin)/admin/dashboard/_components/stat-card-grid";
import {GrowthCharts} from "@/app/(admin)/admin/dashboard/_components/growth-chars";
import {OperationalHealth} from "@/app/(admin)/admin/dashboard/_components/operational-health";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchData = async (endpoint: string, accessToken: string) => {
  const res = await fetch(`${BACKEND_URL}/admin/${endpoint}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Falha ao buscar dados de /admin/${endpoint}`);
  return res.json();
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }

  const [allAffiliations, allClubs, allEnrollments, allUsers] = await Promise.all([
    fetchData('affiliations', session.accessToken) as Promise<FamilyResponseDto[]>,
    fetchData('clubs', session.accessToken) as Promise<ClubDto[]>,
    fetchData('enrollments', session.accessToken) as Promise<EnrollmentRequestDto[]>,
    fetchData('users', session.accessToken) as Promise<UserDto[]>,
  ]);

  // Cálculo de KPIs permanece o mesmo
  const activeAffiliations = allAffiliations.filter(f => f.status === FamilyStatus.AFFILIATED).length;
  const pendingRenewals = allAffiliations.filter(f => f.status === FamilyStatus.EXPIRED).length;
  const totalClubs = allClubs.length;
  const totalMembers = allClubs.reduce((acc, club) => acc + club.corum, 0);
  const pendingEnrollments = allEnrollments.filter(e => e.status === EnrollmentStatus.PENDING).length;

  const kpis = { activeAffiliations, totalClubs, totalMembers, pendingEnrollments, pendingRenewals };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Visão Geral - Admin</h1>
          <p className="mt-1 text-muted-foreground">
            KPIs e métricas de saúde da plataforma em tempo real.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <StatCardGrid kpis={kpis} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <GrowthCharts affiliations={allAffiliations} clubs={allClubs} enrollments={allEnrollments} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <OperationalHealth enrollments={allEnrollments} clubs={allClubs} users={allUsers} />
        </Suspense>
      </div>
  );
}