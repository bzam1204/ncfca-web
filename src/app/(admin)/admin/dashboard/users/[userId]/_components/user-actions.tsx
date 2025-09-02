// src/app/(admin)/admin/dashboard/users/[userId]/_components/user-actions.tsx
'use client';

import { useState } from 'react';
import { useAdminManageUserRoleMutation } from '@/hooks/use-admin-manage-user-role';
import { UserDto } from '@/contracts/api/user.dto';
import { ManageUserRoleDto } from '@/contracts/api/admin.dto';
import { useNotify } from '@/hooks/use-notify';
import { Button } from '@/components/ui/button';
import { ManageRoleDialog } from '../../_components/manage-role-dialog';

interface UserActionsProps {
  user: UserDto;
}

export function UserActions({ user }: UserActionsProps) {
  const notify = useNotify();
  const { mutate: manageRole, isPending } = useAdminManageUserRoleMutation();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const handleRoleChange = (userId: string, roles: ManageUserRoleDto) => {
    manageRole(
      { userId, data: roles },
      {
        onSuccess: () => {
          notify.success('Perfis do usuário atualizados com sucesso.');
          setIsRoleDialogOpen(false);
        },
        onError: (error) => notify.error(error.message),
      },
    );
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
