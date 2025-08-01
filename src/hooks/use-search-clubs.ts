import {useQuery} from "@tanstack/react-query";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

import {QueryKeys} from "@/infraestructure/cache/query-keys";
import {SearchClubs} from "@/application/use-cases/clubs/search-clubs.use-case";

export function useSearchClubs(query: SearchClubsQuery, searchClubs: SearchClubs) {
  return useQuery<PaginatedClubDto>({
    queryKey : QueryKeys.clubs.search(query),
    queryFn : () => searchClubs.execute(query),
  });
}
