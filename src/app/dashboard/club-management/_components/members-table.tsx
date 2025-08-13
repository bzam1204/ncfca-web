'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useClubMembersQuery, useRevokeMembershipMutation} from '@/application/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle, MoreHorizontal, Trash2, Eye, RotateCcw} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {MemberDetailsDialog} from './member-details';

export function MembersTable() {
  const {data : session} = useSession();
  const accessToken = session?.accessToken ?? '';
  const notify = useNotify();
  const [selectedMember, setSelectedMember] = useState<ClubMemberDto | null>(null);

  const {data : members = [], isLoading, error, isRefetching, refetch} = useClubMembersQuery(accessToken);
  const {mutate : revoke, isPending} = useRevokeMembershipMutation();

  const handleRevoke = (membershipId: string) => {
    if (!accessToken) return;
    revoke({membershipId, accessToken}, {
      onSuccess : () => notify.success("Membro removido do clube."),
      onError : (e) => notify.error(e.message),
    });
  };

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
                          <AlertDialog>
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
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(event) => event.stopPropagation()} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remover Membro
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent onClick={e => e.stopPropagation()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá remover permanentemente {member.firstName} do seu clube.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRevoke(member.id)} disabled={isPending}>
                                  Confirmar Remoção
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

