import {QueryService} from "@/domain/services/query.service";

import {DependantQuery} from "@/application/use-cases/queries/dependant.query";
import {ClubQuery} from "@/application/use-cases/queries/club.query";

export class QueryServiceApi implements QueryService {

  constructor(readonly clubQuery: ClubQuery, readonly dependantQuery: DependantQuery) {
  };

}
