import {QueryService} from "@/domain/services/query.service";
import {Dependant} from "@/domain/entities/dependant.entity";

export class GetDependants {
  constructor(private readonly QueryService: QueryService) {
  }

  async execute(): Promise<Dependant[]> {
    return await this.QueryService.dependantQuery.getAll();
  }
}