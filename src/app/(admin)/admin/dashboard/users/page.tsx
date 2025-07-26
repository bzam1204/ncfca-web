// src/app/(admin)/admin/dashboard/users/page.tsx
'use client'; // CONVERTIDO PARA CLIENT COMPONENT

import { Suspense, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/app/(admin)/admin/dashboard/users/_components/users-table";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce"; // Supondo a existência deste hook
import { useAdminListUsers } from "@/use-cases/use-admin-management.use-case";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300); // Debounce de 300ms

  // A busca de dados agora é feita no cliente
  const { data: users = [], isLoading } = useAdminListUsers(session?.accessToken ?? '');

  return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Visualize, filtre e gerencie os perfis de todos os usuários do sistema.
          </CardDescription>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-[26px] h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Filtrar por nome ou email..."
                className="pl-9"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            {isLoading ? (
                <Skeleton className="h-64 w-full" />
            ) : (
                <UsersTable initialData={users} filter={debouncedFilter} />
            )}
          </Suspense>
        </CardContent>
      </Card>
  );
}