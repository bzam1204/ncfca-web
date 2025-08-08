'use client';
import {useQuery} from "@tanstack/react-query";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

import {searchClubsAction} from "@/infraestructure/actions/search-clubs.action";
import {QueryKeys} from "@/infraestructure/cache/query-keys";

export function useSearchClubs(query: SearchClubsQuery,) {
  return useQuery<PaginatedClubDto>({
    queryKey : QueryKeys.clubs.search(query),
    queryFn : () => searchClubsAction(query),
  });
}
