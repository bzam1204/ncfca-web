// src/app/(admin)/admin/dashboard/users/[userId]/_components/user-actions.tsx
'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminManageUserRoleMutation } from "@/use-cases/use-admin-management.use-case";
import { UserDto } from "@/contracts/api/user.dto";
import { ManageUserRoleDto } from "@/contracts/api/admin.dto";
import { useNotify } from "@/hooks/use-notify";
import { Button } from "@/components/ui/button";
import { ManageRoleDialog } from "../../_components/manage-role-dialog";

interface UserActionsProps {
  user: UserDto;
}

export function UserActions({ user }: UserActionsProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';
  const notify = useNotify();

  const { mutate: manageRole, isPending } = useAdminManageUserRoleMutation();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const handleRoleChange = (userId: string, roles: ManageUserRoleDto) => {
    manageRole({ userId, data: roles, accessToken }, {
      onSuccess: () => {
        notify.success("Perfis do usuário atualizados com sucesso.");
        setIsRoleDialogOpen(false);
        // Idealmente, o Next.js revalidaria os dados da página do servidor aqui.
        // router.refresh() seria uma opção se estivéssemos em um layout.
      },
      onError: (error) => notify.error(error.message),
    });
  };

  return (
      <>
        <Button onClick={() => setIsRoleDialogOpen(true)}>Gerenciar Perfis</Button>
        <ManageRoleDialog
            isOpen={isRoleDialogOpen}
            user={user}
            isPending={isPending}
            onClose={() => setIsRoleDialogOpen(false)}
            onSubmit={handleRoleChange}
        />
      </>
  );
}
