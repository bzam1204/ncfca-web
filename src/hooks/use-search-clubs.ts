'use client';

import {useQuery} from "@tanstack/react-query";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

import {searchClubsAction} from "@/infrastructure/actions/search-clubs.action";
import {QueryKeys} from "@/infrastructure/cache/query-keys";

export function useSearchClubs(query: SearchClubsQuery,) {
  return useQuery<PaginatedClubDto>({
    queryKey : QueryKeys.clubs.search.query(query),
    queryFn : () => searchClubsAction(query),
  });
}
