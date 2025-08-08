import {Dependant} from "@/domain/entities/dependant.entity";

export interface FamilyGateway {
  getMyDependants(): Promise<Dependant[]>
}