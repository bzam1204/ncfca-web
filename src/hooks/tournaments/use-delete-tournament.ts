import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTournamentAction } from '@/infrastructure/actions/tournaments/delete-tournament.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useDeleteTournament() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteTournamentAction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QueryKeys.tournaments.search.all() }),
  });
}

