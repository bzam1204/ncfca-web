'use client';

import {useState} from 'react';
import {useAdminClubMembers} from '@/hooks/use-admin-club-members';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle, MoreHorizontal, Eye, RotateCcw} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {MemberDetailsDialog} from './member-details';

interface MembersTableProps {
  clubId: string;
}

export function MembersTable({clubId}: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<ClubMemberDto | null>(null);

  const {data: members = [], isLoading, error, isRefetching, refetch} = useAdminClubMembers(clubId);

  if (isLoading || isRefetching) return <Skeleton className="h-40 w-full" />;
  if (error) return <Alert variant="destructive"><AlertTriangle
      className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
      <div className="flex flex-col gap-4">
        <Button className="w-fit" variant="outline" size="sm" onClick={() => refetch()}><RotateCcw /> Atualizar </Button>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Membro desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                  members.map(member => (
                      <TableRow key={member.id} onClick={() => setSelectedMember(member)} className="cursor-pointer">
                        <TableCell className="font-medium flex items-center gap-3">
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>{member.memberSince ? new Date(member.memberSince).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button onClick={e => e.stopPropagation()} variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                              <DropdownMenuItem onSelect={() => setSelectedMember(member)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Nenhum membro ativo no clube.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <MemberDetailsDialog member={selectedMember} onOpenChange={(isOpen) => !isOpen && setSelectedMember(null)} />
      </div>
  );
}