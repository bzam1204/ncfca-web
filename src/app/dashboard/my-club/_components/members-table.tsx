'use client';

import { useState, useCallback } from 'react';

import { AlertTriangle, MoreHorizontal, Eye, RotateCcw, Search, Ban } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useConfirmationDialog } from '@/components/confirmation-dialog';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ClubMemberDto } from '@/contracts/api/club-member.dto';

import { useRevokeMembershipMutation } from '@/hooks/clubs/use-revoke-membership';
import { useSearchMyClubMembers } from '@/hooks/clubs/use-search-my-club-members';
import { useDebounce } from '@/hooks/misc/use-debounce';
import { useNotify } from '@/hooks/misc/use-notify';

import { MemberDetailsDialog } from './member-details';

export function MembersTable({ clubId }: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<ClubMemberDto | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const debouncedNameFilter = useDebounce(nameFilter, 500);
  const query = {
    pagination: { page: currentPage, limit: pageSize },
    clubId,
    filter: debouncedNameFilter ? { name: debouncedNameFilter } : undefined,
  };
  const { data: paginatedMembers, isLoading: isLoadingMembers, error, isRefetching, refetch } = useSearchMyClubMembers(query);
  const members = paginatedMembers?.data || [];
  const pagination = paginatedMembers?.meta;
  const dialog = useConfirmationDialog();
  const notify = useNotify();
  const { mutateAsync: revokeAsync, isPending: isRevoking } = useRevokeMembershipMutation();
  const handleNameFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
    setCurrentPage(1);
  }, []);
  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);
  const handleMemberSelect = useCallback((member: ClubMemberDto | null) => {
    setSelectedMember(member);
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={nameFilter}
              onChange={handleNameFilterChange}
              className="pl-8 w-64"
              placeholder="Filtrar por nome..."
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefetch} disabled={isRefetching}>
          <RotateCcw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      {isLoadingMembers && !paginatedMembers ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="border rounded-md relative">
          {isRefetching && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
              <div className="bg-background border rounded-md p-2 shadow-sm">
                <RotateCcw className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Membro desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    onClick={() => handleMemberSelect(member)}
                    className={`cursor-pointer hover:bg-muted/50 ${isRefetching ? 'opacity-50' : ''}`}
                  >
                    <TableCell className="font-medium">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>{member.memberSince ? new Date(member.memberSince).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon" disabled={isRefetching || isRevoking}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onSelect={() => handleMemberSelect(member)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onSelect={async () => {
                              const confirmed = await dialog({
                                title: 'Revogar matrícula',
                                description: (
                                  <div className="space-y-2 text-left">
                                    <p>
                                      Tem certeza que deseja revogar a matrícula de {member.firstName} {member.lastName}?
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                      Esta ação não pode ser desfeita e o membro perderá acesso imediato às atividades do clube.
                                    </p>
                                  </div>
                                ),
                                confirmText: 'Revogar',
                                cancelText: 'Cancelar',
                                variant: 'destructive',
                                onConfirm: async () => {
                                  try {
                                    await revokeAsync({ membershipId: member.id, clubId });
                                    notify.success('Matrícula revogada com sucesso.');
                                  } catch (err: any) {
                                    notify.error(err?.message || 'Falha ao revogar matrícula.');
                                    throw err;
                                  }
                                },
                              });
                              // If needed, we could do something with the result
                              if (!confirmed) return;
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Revogar Matrícula
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {isLoadingMembers ? (
                      <Skeleton className="h-6 w-32 mx-auto" />
                    ) : (
                      debouncedNameFilter ? 'Nenhum membro encontrado com os filtros aplicados.' : 'Nenhum membro ativo no clube.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {selectedMember && (
        <MemberDetailsDialog
          member={selectedMember}
          onOpenChange={(isOpen) => !isOpen && handleMemberSelect(null)}
        />
      )}
    </div>
  );
}

interface MembersTableProps {
  clubId: string;
}
