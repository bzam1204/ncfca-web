// src/app/(admin)/_components/operational-health.tsx
'use client';

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnrollmentRequestDto } from "@/contracts/api/enrollment.dto";
import { ClubDto } from "@/contracts/api/club.dto";
import { UserDto } from "@/contracts/api/user.dto";
import { EnrollmentStatus } from "@/domain/enums/enrollment-status.enum";

interface OperationalHealthProps {
  enrollments: EnrollmentRequestDto[];
  clubs: ClubDto[];
  users: UserDto[];
}

export function OperationalHealth({ enrollments, clubs, users }: OperationalHealthProps) {
  const pendingByClub = useMemo(() => {
    const pendingMap = new Map<string, number>();
    enrollments.forEach(e => {
      if (e.status === EnrollmentStatus.PENDING) {
        pendingMap.set(e.clubId, (pendingMap.get(e.clubId) || 0) + 1);
      }
    });

    return Array.from(pendingMap.entries())
        .map(([clubId, count]) => {
          const club = clubs.find(c => c.id === clubId);
          const director = users.find(u => u.id === club?.principalId);
          return {
            clubName: club?.name || 'Clube Desconhecido',
            directorName: director ? `${director.firstName} ${director.lastName}` : 'N/A',
            pendingCount: count,
          };
        })
        .sort((a, b) => b.pendingCount - a.pendingCount)
        .slice(0, 5); // Limita aos 5 maiores gargalos
  }, [enrollments, clubs, users]);

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
                    <TableCell>{item.directorName}</TableCell>
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
