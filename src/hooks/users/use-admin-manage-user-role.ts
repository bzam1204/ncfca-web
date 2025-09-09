'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { manageUserRoleAction } from '@/infrastructure/actions/admin/manage-user-role.action';
import { ManageUserRoleDto } from '@/contracts/api/admin.dto';

interface ManageUserRoleParams {
  userId: string;
  data: ManageUserRoleDto;
}

export function useAdminManageUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: ManageUserRoleParams) => manageUserRoleAction(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.userById(userId) });
      // TODO: Adicionar QueryKeys.admin.users() quando necessário
    },
  });
}
