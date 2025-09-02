'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotify } from './use-notify';
import { changeClubPrincipalAction } from '@/infrastructure/actions/admin/change-club-principal.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useChangePrincipal() {
  const notify = useNotify();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, newPrincipalId }: { clubId: string, newPrincipalId: string }) => 
      changeClubPrincipalAction(clubId, newPrincipalId),
    onSuccess: () => {
      notify.success('Principal alterado com sucesso.');
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubs() });
    },
    onError: (error) => notify.error(error.message),
  });
}