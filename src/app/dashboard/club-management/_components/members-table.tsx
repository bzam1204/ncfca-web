// src/app/dashboard/club-management/_components/members-table.tsx
'use client';

import {useSession} from 'next-auth/react';
import {
  useClubMembersQuery,
  useRevokeMembershipMutation
} from '@/hooks/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle, Eye, MoreHorizontal, Trash2} from "lucide-react";
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
} from "@/components/ui/alert-dialog"
import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useState} from "react";
import {MemberDetailsDialog} from "@/app/dashboard/club-management/_components/member-details";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface MembersTableProps {
  clubId: string;
}

export function MembersTable({}: MembersTableProps) {
  const {data : session} = useSession();
  const notify = useNotify();
  const [selectedMember, setSelectedMember] = useState<ClubMemberDto | null>(null);
  const {mutate : revoke, isPending} = useRevokeMembershipMutation();

  const {
    data : members = [],
    isLoading,
    error
  } = useClubMembersQuery(session?.accessToken ?? '');

  const handleRevoke = (membershipId: string) => {
    if (!session?.accessToken) return;
    revoke({membershipId, accessToken : session.accessToken}, {
      onSuccess : () => notify.success("Membro removido do clube."),
      onError : (e) => notify.error(e.message),
    });
  };

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (error) return <Alert variant="destructive"><AlertTriangle
      className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
      <>
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
                      <TableRow key={member.id}>
                        <TableCell className="font-medium flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatarUrl ?? `https://i.pravatar.cc/150?u=${member.firstName}`}
                                         alt={member.firstName} />
                            <AvatarFallback>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>{member.memberSince ? new Date(member.memberSince).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setSelectedMember(member)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remover Membro
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
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
      </>
  );
}
