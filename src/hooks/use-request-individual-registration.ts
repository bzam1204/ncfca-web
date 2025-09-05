'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RequestIndividualRegistrationInputDto, RequestIndividualRegistrationOutputDto } from '@/contracts/api/registration.dto';

import { useNotify } from '@/hooks/use-notify';

import { requestIndividualRegistrationAction } from '@/infrastructure/actions/registrations/request-individual-registration.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRequestIndividualRegistration() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  return useMutation<RequestIndividualRegistrationOutputDto, Error, RequestIndividualRegistrationInputDto>({
    mutationFn: requestIndividualRegistrationAction,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.mine() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.registrations.pending() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.details(variables.tournamentId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.search.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.featuredTournaments.all() });
      notify.success('Inscrição individual realizada com sucesso!');
    },
    onError: (error) => {
      notify.error(`Falha ao realizar inscrição: ${error.message}`);
    },
  });
}
