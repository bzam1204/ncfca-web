import {FamilyGateway} from "@/application/gateways/family.gateway";
import {Dependant} from "@/domain/entities/dependant.entity";

export class GetDependants {
  constructor(private readonly familyGateway: FamilyGateway) {
  }

  async execute(): Promise<Dependant[]> {
    return await this.familyGateway.getMyDependants();
  }
}