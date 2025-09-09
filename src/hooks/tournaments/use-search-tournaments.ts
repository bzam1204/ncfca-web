import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { SearchTournamentsQuery, SearchTournamentsView } from '@/contracts/api/tournament.dto';

import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { searchTournamentsAction } from '@/infrastructure/actions/tournaments/search-tournaments.action';

export function useSearchTournaments(query?: SearchTournamentsQuery) {
  const queryResult = useQuery<SearchTournamentsView>({
    queryKey: QueryKeys.tournaments.search.query(query ?? {}),
    queryFn: () => searchTournamentsAction(query ?? {}),
    staleTime: 5 * 60 * 1000,
  });
  const tournaments = useMemo(() => {
    return queryResult.data?.data ?? [];
  }, [queryResult.data?.data]);
  const meta = useMemo(() => {
    return queryResult.data?.meta;
  }, [queryResult.data?.meta]);
  return {
    tournaments,
    meta,
    ...queryResult,
  };
}