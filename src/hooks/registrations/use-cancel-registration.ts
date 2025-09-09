'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CancelRegistrationDto } from '@/contracts/api/registration.dto';

import { useNotify } from '@/hooks/misc/use-notify';

import { cancelRegistrationAction } from '@/infrastructure/actions/registrations/cancel-registration.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

interface UseCancelRegistrationOptions {
  tournamentId?: string;
}

export function useCancelRegistration(options?: UseCancelRegistrationOptions) {
  const notify = useNotify();
  const queryClient = useQueryClient();
  return useMutation<void, Error, CancelRegistrationDto>({
    mutationFn: cancelRegistrationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.mine() });
      if (options?.tournamentId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.details(options.tournamentId) });
      }
      notify.success('Inscrição cancelada com sucesso.');
    },
    onError: (error) => {
      notify.error(`Falha ao cancelar inscrição: ${error.message}`);
    },
  });
}
