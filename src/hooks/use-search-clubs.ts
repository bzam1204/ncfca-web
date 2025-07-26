import {useQuery} from "@tanstack/react-query";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";
import {SearchClubs} from "@/use-cases/clubs/search-clubs.use-case";
import {ApiQueryService} from "@/lib/services/query.service.api";

export function useSearchClubs(accessToken: string, query: SearchClubsQuery) {
  const queryService = ApiQueryService.create(accessToken);
  const searchClubs = new SearchClubs(queryService);
  return useQuery<PaginatedClubDto>({
    queryKey : ['search-clubs', query],
    queryFn : () => searchClubs.execute(query),
    enabled : !!accessToken,
  });
}