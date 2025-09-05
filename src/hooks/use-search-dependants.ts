'use client';

import { useQuery } from '@tanstack/react-query';

import { SearchDependantsFilter, SearchDependantsView } from '@/contracts/api/dependants-search.dto';
import { searchDependantsAction } from '@/infrastructure/actions/search-dependants.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { PaginationDto } from '@/contracts/api/pagination.dto';

export function useSearchDependants(filter: SearchDependantsFilter, enabled: boolean = true, pagination?: PaginationDto) {
  return useQuery<SearchDependantsView>({
    queryKey: QueryKeys.dependants.search(filter),
    queryFn: () => searchDependantsAction(filter, pagination),
    enabled: enabled,
    staleTime: 30 * 1000,
  });
}

