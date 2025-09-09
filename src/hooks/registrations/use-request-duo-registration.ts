'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RequestDuoRegistrationDto, RequestDuoRegistrationOutputDto } from '@/contracts/api/registration.dto';

import { useNotify } from '@/hooks/misc/use-notify';

import { requestDuoRegistrationAction } from '@/infrastructure/actions/registrations/request-duo-registration.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRequestDuoRegistration() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  return useMutation<RequestDuoRegistrationOutputDto, Error, RequestDuoRegistrationDto>({
    mutationFn: requestDuoRegistrationAction,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.mine() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.pending() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.details(variables.tournamentId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.search.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.featuredTournaments.all() });
      notify.success('Convite para inscrição em dupla enviado! Aguarde a aprovação do parceiro.');
    },
    onError: (error) => {
      notify.error(`Falha ao enviar convite para dupla: ${error.message}`);
    },
  });
}
