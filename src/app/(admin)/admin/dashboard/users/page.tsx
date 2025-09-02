'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UsersTable } from '@/app/(admin)/admin/dashboard/users/_components/users-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchUsers } from '@/hooks/use-search-users';
import { SearchUsersQuery } from '@/contracts/api/user.dto';
import { UserRoles } from '@/domain/enums/user.roles';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [cpfFilter, setCpfFilter] = useState('');
  const [rgFilter, setRgFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRoles | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce text-based filters to avoid excessive API calls
  const debouncedNameFilter = useDebounce(nameFilter, 500);
  const debouncedEmailFilter = useDebounce(emailFilter, 500);
  const debouncedCpfFilter = useDebounce(cpfFilter, 500);
  const debouncedRgFilter = useDebounce(rgFilter, 500);

  // Build search query
  const searchQuery: SearchUsersQuery = {
    name: debouncedNameFilter || undefined,
    email: debouncedEmailFilter || undefined,
    cpf: debouncedCpfFilter || undefined,
    rg: debouncedRgFilter || undefined,
    role: roleFilter || undefined,
    page: currentPage,
    limit: limit,
  };

  // Check if we have any active filters (for display purposes)
  const hasActiveFilters = Boolean(debouncedNameFilter || debouncedEmailFilter || debouncedCpfFilter || debouncedRgFilter || roleFilter);

  // Always enable search to get paginated results, even with no filters
  const { data: searchResult, isLoading, error } = useSearchUsers(searchQuery, true);

  const users = searchResult?.data || [];
  const totalPages = searchResult?.meta?.totalPages || 1;
  const totalUsers = searchResult?.meta?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setNameFilter('');
    setEmailFilter('');
    setCpfFilter('');
    setRgFilter('');
    setRoleFilter('');
    setCurrentPage(1);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleManualSearch = () => {
    // Force a refresh by resetting to page 1
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>Visualize, filtre e gerencie os perfis de todos os usuários do sistema.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline">
                  Limpar filtros
                </button>
              )}
            </div>
            <Button onClick={handleManualSearch} size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por nome..." className="pl-9" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
            </div>

            {/* Email Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por email..." className="pl-9" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter || undefined} onValueChange={(value) => setRoleFilter(value === 'all' ? '' : (value as UserRoles))}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os perfis</SelectItem>
                <SelectItem value={UserRoles.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRoles.DONO_DE_CLUBE}>Dono de Clube</SelectItem>
                <SelectItem value={UserRoles.SEM_FUNCAO}>Sem Função</SelectItem>
              </SelectContent>
            </Select>

            {/* CPF Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por CPF..." className="pl-9" value={cpfFilter} onChange={(e) => setCpfFilter(e.target.value)} />
            </div>

            {/* RG Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por RG..." className="pl-9" value={rgFilter} onChange={(e) => setRgFilter(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Results Summary and Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Buscando usuários...'
            ) : error ? (
              'Erro ao buscar usuários'
            ) : (
              <>
                {totalUsers} usuário(s) encontrado(s)
                {hasActiveFilters && ' com os filtros aplicados'}
              </>
            )}
          </div>

          {/* Results per page selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Mostrar:</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">por página</span>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Erro ao carregar usuários</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum usuário encontrado</p>
            <p className="text-sm">
              {hasActiveFilters ? 'Tente ajustar os filtros para encontrar usuários' : 'Não há usuários cadastrados no sistema'}
            </p>
          </div>
        ) : (
          <UsersTable users={users} />
        )}

        {/* Pagination Controls */}
        {users.length > 0 && totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </CardContent>
    </Card>
  );
}
