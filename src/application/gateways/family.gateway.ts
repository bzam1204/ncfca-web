import {Dependant} from '@/domain/entities/dependant.entity';
import {Family} from '@/domain/entities/entities';

import {AddDependantRequestDto, DependantDto, UpdateDependantRequestDto} from '@/contracts/api/dependant.dto';

export interface FamilyGateway {
  getDependantById(dependantId: string): Promise<DependantDto>;

  updateDependant(dependantId: string, data: UpdateDependantRequestDto): Promise<Dependant>;

  deleteDependant(dependantId: string): Promise<void>;

  getMyDependants(): Promise<DependantDto[]>;

  addDependant(data: AddDependantRequestDto): Promise<Dependant>;

  getMyFamily(): Promise<Family>;

  checkout(params: {paymentMethod: string; paymentToken: string}): Promise<void>;
}
