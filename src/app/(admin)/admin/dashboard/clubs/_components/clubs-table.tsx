'use client';

import {useState} from "react";
import {MoreHorizontal} from "lucide-react";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

// TODO: Migrar para novo padrão Hook → Action → Gateway
// import {useAdminListClubs} from "@/application/use-cases/use-admin-management.use-case";


import {Club, User} from "@/domain/entities/entities";
import { ChangePrincipalDialog } from "../[clubId]/_components/change-principal-dialog";

interface ClubsTableProps {
  initialClubs: Club[];
  allUsers: User[];
}

export function ClubsTable({initialClubs, allUsers}: ClubsTableProps) {
  // TODO: Migrar para novo padrão Hook → Action → Gateway
  // const {data : session} = useSession();
  // const accessToken = session?.accessToken ?? '';
  // const {data : clubs = initialClubs} = useAdminListClubs(accessToken);
  const clubs = initialClubs; // Usar dados iniciais até migração completa

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const findDirectorName = (principalId: string) => {
    const director = allUsers.find(user => user.id === principalId);
    return director ? `${director.firstName} ${director.lastName}` : 'Desconhecido';
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
                    <TableCell>{`${club.address.city}, ${club.address.state}`}</TableCell>
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
            onClose={() => setSelectedClub(null)}
        />
      </>
  );
}
