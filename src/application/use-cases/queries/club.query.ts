import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export interface ClubQuery {
  searchClubs(input: SearchClubsQuery): Promise<PaginatedClubDto>;
}
