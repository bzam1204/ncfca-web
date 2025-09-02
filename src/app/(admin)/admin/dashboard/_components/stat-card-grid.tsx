import {Users, Shield, CreditCard, Clock, RefreshCw} from "lucide-react";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {EnrollmentStatus} from "@/domain/enums/enrollment-status.enum";

import {getAffiliationsAction} from "@/infrastructure/actions/admin/get-affiliations.action";
import {getEnrollmentsAction} from "@/infrastructure/actions/admin/get-enrollments.action";
import {getClubsAction} from "@/infrastructure/actions/admin/get-clubs.action";

export async function StatCardGrid() {
  const [allAffiliations, allEnrollments, allClubs] = await Promise.all([getAffiliationsAction(), getEnrollmentsAction(), getClubsAction(),]);
  const activeAffiliations = allAffiliations.filter(f => f.status === FamilyStatus.AFFILIATED).length;
  const pendingRenewals = allAffiliations.filter(f => f.status === FamilyStatus.EXPIRED).length;
  const totalClubs = allClubs.length;
  const totalMembers = allClubs.reduce((acc, club) => acc + (club.corum || 0), 0);
  const pendingEnrollments = allEnrollments.filter(e => e.status === EnrollmentStatus.PENDING).length;

  const kpis = {activeAffiliations, totalClubs, totalMembers, pendingEnrollments, pendingRenewals};

  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Famílias Ativas" value={kpis.activeAffiliations} icon={CreditCard} />
        <StatCard title="Clubes Ativos" value={kpis.totalClubs} icon={Shield} />
        <StatCard title="Membros Ativos" value={kpis.totalMembers} icon={Users} />
        <StatCard title="Matrículas Pendentes" value={kpis.pendingEnrollments} icon={Clock} />
        <StatCard title="Renovações Pendentes" value={kpis.pendingRenewals} icon={RefreshCw} />
      </div>
  );
}

const StatCard = ({title, value, icon : Icon}: {title: string, value: number, icon: React.ElementType}) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString('pt-BR')}</div>
      </CardContent>
    </Card>
);