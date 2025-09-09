'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotify } from '@/hooks/misc/use-notify';

import { rejectDuoRegistrationAction } from '@/infrastructure/actions/registrations/reject-duo-registration.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRejectDuoRegistration() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: rejectDuoRegistrationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.pending() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.mine() });
      notify.success('Convite para dupla recusado.');
    },
    onError: (error) => {
      notify.error(`Falha ao recusar convite: ${error.message}`);
    },
  });
}
