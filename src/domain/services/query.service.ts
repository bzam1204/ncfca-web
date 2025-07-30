import {ClubQuery} from "@/application/use-cases/queries/club.query";
import {DependantQuery} from "@/application/use-cases/queries/dependant.query";

export interface QueryService {
  readonly clubQuery: ClubQuery;
  readonly dependantQuery: DependantQuery;
}
