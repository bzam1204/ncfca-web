import {Dependant} from '@/domain/entities/dependant.entity';
import {Family} from '@/domain/entities/entities';

import {AddDependantRequestDto, DependantDto, UpdateDependantRequestDto} from '@/contracts/api/dependant.dto';
import { SearchDependantsFilter, SearchDependantsView } from '@/contracts/api/dependants-search.dto';
import { PaginationDto } from '@/contracts/api/pagination.dto';

export interface FamilyGateway {
  getDependantById(dependantId: string): Promise<DependantDto>;

  updateDependant(dependantId: string, data: UpdateDependantRequestDto): Promise<Dependant>;

  deleteDependant(dependantId: string): Promise<void>;

  getMyDependants(): Promise<DependantDto[]>;

  addDependant(data: AddDependantRequestDto): Promise<Dependant>;

  getMyFamily(): Promise<Family>;

  checkout(params: {paymentMethod: string; paymentToken: string}): Promise<void>;

  /**
   * Busca dependentes por email (parcial, case-insensitive)
   * OpenAPI: GET /dependants/search
   */
  searchDependants(filter: SearchDependantsFilter, pagination?: PaginationDto): Promise<SearchDependantsView>;
}
