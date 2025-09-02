import { Dependant } from '@/domain/entities/dependant.entity';
import { Family } from '@/domain/entities/entities';
import { AddDependantRequestDto, DependantDto, UpdateDependantRequestDto } from '@/contracts/api/dependant.dto';

export interface FamilyGateway {
  /**
   * Retorna informações da família do usuário autenticado
   * OpenAPI: GET /family/me
   */
  getMyFamily(): Promise<Family>;

  getMyDependants(): Promise<DependantDto[]>;

  /**
   * Busca detalhes de um dependente específico
   * OpenAPI: GET /dependants/{dependantId}
   */
  getDependantById(dependantId: string): Promise<Dependant>;

  /**
   * Adiciona um novo dependente à família
   * OpenAPI: POST /dependants
   */
  addDependant(data: AddDependantRequestDto): Promise<Dependant>;

  /**
   * Atualiza dados de um dependente
   * OpenAPI: PUT /dependants/{dependantId}
   */
  updateDependant(dependantId: string, data: UpdateDependantRequestDto): Promise<Dependant>;

  /**
   * Remove um dependente da família
   * OpenAPI: DELETE /dependants/{dependantId}
   */
  deleteDependant(dependantId: string): Promise<void>;

  /**
   * Processa pagamento de afiliação familiar
   * OpenAPI: POST /checkout
   */
  checkout(params: { paymentMethod: string; paymentToken: string }): Promise<void>;
}
