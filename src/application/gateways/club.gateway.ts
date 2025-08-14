import {Club} from "@/domain/entities/entities";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";
import {UpdateClubDto} from "@/contracts/api/club-management.dto";

export interface ClubGateway {
  myClub(): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  getById(clubId: string): Promise<Club>;
  updateMyClub(payload: UpdateClubDto): Promise<Club>;
}
