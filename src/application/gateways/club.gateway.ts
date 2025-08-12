import {Club} from "@/domain/entities/entities";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export interface ClubGateway {
  myClub(): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  getById(clubId: string): Promise<Club>;
}
