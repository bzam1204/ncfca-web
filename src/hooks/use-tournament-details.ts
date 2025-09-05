import { useQuery } from '@tanstack/react-query';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getTournamentDetailsAction } from '@/infrastructure/actions/tournaments/get-tournament-details.action';

export function useTournamentDetails(id: string) {
  const query = useQuery<TournamentDetailsView>({
    queryKey: QueryKeys.tournaments.details(id),
    queryFn: () => getTournamentDetailsAction(id),
    staleTime: 5 * 60 * 1000,
  });
  return {
    tournament: query.data,
    ...query,
  };
}