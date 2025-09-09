'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotify } from '@/hooks/misc/use-notify';

import { acceptDuoRegistrationAction } from '@/infrastructure/actions/registrations/accept-duo-registration.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useAcceptDuoRegistration() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: acceptDuoRegistrationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.pending() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.mine() });
      notify.success('Convite para dupla aceito com sucesso!');
    },
    onError: (error) => {
      notify.error(`Falha ao aceitar convite: ${error.message}`);
    },
  });
}
