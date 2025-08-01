// src/app/(admin)/admin/dashboard/users/_components/users-table.tsx
'use client';

import { useState, useMemo } from "react"; // Adicionado useMemo
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAdminManageUserRoleMutation } from "@/application/use-cases/use-admin-management.use-case";
import { UserDto } from "@/contracts/api/user.dto";
import { ManageUserRoleDto } from "@/contracts/api/admin.dto";
import { useNotify } from "@/hooks/use-notify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { ManageRoleDialog } from "./manage-role-dialog";

// A prop de filtro é adicionada
export function UsersTable({ initialData, filter }: { initialData: UserDto[], filter: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';
  const notify = useNotify();

  const { mutate: manageRole, isPending } = useAdminManageUserRoleMutation();

  const [userForRoleManagement, setUserForRoleManagement] = useState<UserDto | null>(null);

  // Lógica de filtragem
  const filteredUsers = useMemo(() => {
    if (!filter) {
      return initialData;
    }
    return initialData.filter(user =>
        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [initialData, filter]);

  const handleRoleChange = (userId: string, roles: ManageUserRoleDto) => {
    manageRole({ userId, data: roles, accessToken }, {
      onSuccess: () => {
        notify.success("Perfis do usuário atualizados com sucesso.");
        setUserForRoleManagement(null);
      },
      onError: (error) => notify.error(error.message),
    });
  };

  const navigateToUserDetails = (userId: string) => {
    router.push(`/admin/dashboard/users/${userId}`);
  };

  return (
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfis</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                  <TableRow key={user.id} onClick={() => navigateToUserDetails(user.id)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.map(role => <Badge key={role} variant="secondary">{role}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={(e) => {
                            e.stopPropagation();
                            setUserForRoleManagement(user);
                          }}>
                            Gerenciar Perfis
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ManageRoleDialog
            isOpen={!!userForRoleManagement}
            user={userForRoleManagement}
            isPending={isPending}
            onClose={() => setUserForRoleManagement(null)}
            onSubmit={handleRoleChange}
        />
      </>
  );
}