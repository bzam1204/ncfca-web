import {QueryService} from "@/domain/services/query.service";

import {ClubQuery} from "@/hooks/queries/club.query";

import {ClubQueryApi} from "@/lib/queries/club.query.api";

export class ApiQueryService implements QueryService {

  private constructor(readonly clubQuery: ClubQuery) {
  };

  static create(accessToken: string): ApiQueryService {
    const clubQuery = new ClubQueryApi(accessToken);
    return new ApiQueryService(clubQuery);
  };

}
