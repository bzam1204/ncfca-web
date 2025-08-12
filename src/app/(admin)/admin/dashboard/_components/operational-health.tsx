import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEnrollmentsAction } from "@/infraestructure/actions/admin/get-enrollments.action";
import { getClubsAction } from "@/infraestructure/actions/admin/get-clubs.action";
import { getUsersAction } from "@/infraestructure/actions/admin/get-users.action";
import { EnrollmentStatus } from "@/domain/enums/enrollment-status.enum";
import {searchUsersAction} from "@/infraestructure/actions/admin/search-users.action";

export async function OperationalHealth() {
  const [enrollments, clubs, users] = await Promise.all([
    getEnrollmentsAction(),
    getClubsAction(),
    searchUsersAction({limit:9999999}),
  ]);

  const pendingMap = new Map<string, number>();
  enrollments.forEach(e => {
    if (e.status === EnrollmentStatus.PENDING) {
      pendingMap.set(e.clubId, (pendingMap.get(e.clubId) || 0) + 1);
    }
  });

  const pendingByClub = Array.from(pendingMap.entries())
      .map(([clubId, count]) => {
        const club = clubs.find(c => c.id === clubId);
        const principal = users.data.find(u => u.id === club?.principalId);
        return {
          clubName: club?.name || 'Clube Desconhecido',
          principalName: principal ? `${principal.firstName} ${principal.lastName}` : 'N/A',
          pendingCount: count,
        };
      })
      .sort((a, b) => b.pendingCount - a.pendingCount)
      .slice(0, 5); // Limita aos 5 maiores gargalos

  return (
      <Card>
        <CardHeader>
          <CardTitle>Saúde Operacional</CardTitle>
          <CardDescription>Clubes com o maior número de matrículas pendentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Clube</TableHead>
                <TableHead>Diretor</TableHead>
                <TableHead className="text-right">Pendentes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingByClub.length > 0 ? pendingByClub.map(item => (
                  <TableRow key={item.clubName}>
                    <TableCell className="font-medium">{item.clubName}</TableCell>
                    <TableCell>{item.principalName}</TableCell>
                    <TableCell className="text-right font-bold text-lg">{item.pendingCount}</TableCell>
                  </TableRow>
              )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Nenhum gargalo identificado. Todas as matrículas estão em dia.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
