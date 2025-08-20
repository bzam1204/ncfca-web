import {ClubGateway} from "@/application/gateways/club.gateway";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export class SearchClubs {

  constructor(private clubGateway: ClubGateway) {
  };

  async execute(query: SearchClubsQuery): Promise<PaginatedClubDto> {
    return await this.clubGateway.search(query);
  };
  
}
