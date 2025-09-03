'use client';

import {useState, useCallback} from 'react';

import {AlertTriangle, MoreHorizontal, Eye, RotateCcw, Search} from 'lucide-react';

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {PaginationControls} from '@/components/ui/pagination-controls';
import {ClubMemberDto} from '@/contracts/api/club-member.dto';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

import {useAdminClubMembers} from '@/hooks/use-admin-club-members';
import {useDebounce} from '@/hooks/use-debounce';

import {MemberDetailsDialog} from './member-details';

export function MembersTable({clubId}: MembersTableProps) {
  const [selectedMember, setSelectedMember] = useState<ClubMemberDto | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const debouncedNameFilter = useDebounce(nameFilter, 500);

  const query = {
    clubId,
    filter : debouncedNameFilter ? {name : debouncedNameFilter} : undefined,
    pagination : {page : currentPage, limit : pageSize},
  };

  const {data : paginatedMembers, isLoading : isLoadingMembers, error, isRefetching, refetch} = useAdminClubMembers(query);
  const members = paginatedMembers?.data || [];
  const pagination = paginatedMembers?.meta;

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
                  placeholder="Filtrar por nome..."
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                  className="pl-8 w-64"
              />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>

        {isLoadingMembers || isRefetching ? (
            <Skeleton className="h-40 w-full" />
        ) : (
            <div className="border rounded-md">
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
                          <TableRow key={member.id} onClick={() => handleMemberSelect(member)} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {member.firstName} {member.lastName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{member.email}</TableCell>
                            <TableCell>{member.memberSince ? new Date(member.memberSince).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                  <DropdownMenuItem onSelect={() => handleMemberSelect(member)}>
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
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          {debouncedNameFilter ? 'Nenhum membro encontrado com os filtros aplicados.' : 'Nenhum membro ativo no clube.'}
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
        
        <MemberDetailsDialog
            member={selectedMember}
            onOpenChange={(isOpen) => !isOpen && handleMemberSelect(null)}
        />
      </div>
  );
}

interface MembersTableProps {
  clubId: string;
}
