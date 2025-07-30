import {Dependant} from "@/domain/entities/dependant.entity";

export interface DependantQuery {
  getAll(): Promise<Dependant[]>;
}
