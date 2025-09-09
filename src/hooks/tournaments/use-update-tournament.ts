import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TournamentResponseDto, UpdateTournamentDto } from '@/contracts/api/tournament.dto';

import { updateTournamentAction } from '@/infrastructure/actions/tournaments/update-tournament.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useUpdateTournament() {
  const queryClient = useQueryClient();
  return useMutation<TournamentResponseDto, Error, { id: string; dto: UpdateTournamentDto }>({
    mutationFn: ({ id, dto }) => updateTournamentAction(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.details(id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.search.all() });
    },
  });
}

