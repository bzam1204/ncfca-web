// src/app/(admin)/_components/clubs-table.tsx
'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminChangeClubDirectorMutation, useAdminListClubs } from "@/use-cases/use-admin-management.use-case";
import { ClubDto } from "@/contracts/api/club.dto";
import { UserDto } from "@/contracts/api/user.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import {ChangePrincipalDialog} from "@/app/(admin)/admin/dashboard/clubs/_components/change-principal-dialog";

interface ClubsTableProps {
  initialClubs: ClubDto[];
  allUsers: UserDto[];
}

export function ClubsTable({ initialClubs, allUsers }: ClubsTableProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';
  const notify = useNotify();

  const { data: clubs = initialClubs } = useAdminListClubs(accessToken);
  const { mutate: changeDirector, isPending } = useAdminChangeClubDirectorMutation();

  const [selectedClub, setSelectedClub] = useState<ClubDto | null>(null);

  const findDirectorName = (principalId: string) => {
    const director = allUsers.find(user => user.id === principalId);
    return director ? `${director.firstName} ${director.lastName}` : 'Desconhecido';
  };

  const handleDirectorChange = (clubId: string, newDirectorId: string) => {
    changeDirector({ clubId, data: { newDirectorId }, accessToken }, {
      onSuccess: () => {
        notify.success("Diretor do clube alterado com sucesso.");
        setSelectedClub(null);
      },
      onError: (error) => notify.error(error.message),
    });
  };

  return (
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Clube</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Diretor Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map(club => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>{`${club.city}, ${club.state}`}</TableCell>
                    <TableCell>{findDirectorName(club.principalId)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setSelectedClub(club)}>
                            Alterar Diretor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <ChangePrincipalDialog
            isOpen={!!selectedClub}
            club={selectedClub}
            users={allUsers}
            isPending={isPending}
            onClose={() => setSelectedClub(null)}
            onSubmit={handleDirectorChange}
        />
      </>
  );
}
