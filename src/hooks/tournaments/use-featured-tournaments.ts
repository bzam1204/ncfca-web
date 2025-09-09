import { useQuery } from '@tanstack/react-query';

import { FeaturedTournamentResponseDto } from '@/contracts/api/tournament.dto';

import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { listFeaturedTournamentsAction } from '@/infrastructure/actions/tournaments/list-featured-tournaments.action';

export function useFeaturedTournaments() {
  const query = useQuery<FeaturedTournamentResponseDto[]>({
    queryKey: QueryKeys.featuredTournaments.all(),
    queryFn: () => listFeaturedTournamentsAction(),
    staleTime: 5 * 60 * 1000,
  });
  return {
    featuredTournaments: query.data ?? [],
    ...query,
  };
}