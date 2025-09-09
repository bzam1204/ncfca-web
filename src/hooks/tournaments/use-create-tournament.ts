import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateTournamentDto, TournamentResponseDto } from '@/contracts/api/tournament.dto';

import { createTournamentAction } from '@/infrastructure/actions/tournaments/create-tournament.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useCreateTournament() {
  const queryClient = useQueryClient();
  return useMutation<TournamentResponseDto, Error, CreateTournamentDto>({
    mutationFn: (dto) => createTournamentAction(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.search.all() }),
  });
}

