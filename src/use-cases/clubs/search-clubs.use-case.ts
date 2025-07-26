import {QueryService} from "@/domain/services/query.service";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export class SearchClubs {
  constructor(private queryService: QueryService) {
  }

  async execute(query: SearchClubsQuery): Promise<PaginatedClubDto> {
    return await this.queryService.clubQuery.searchClubs(query);
  }
}
