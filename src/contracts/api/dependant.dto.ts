/**
 * @file Contratos de DTO para a API de Dependentes.
 * @description Única fonte da verdade para os payloads da API de dependentes.
 * @source openapi.json
 */


import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {Sex} from "@/domain/enums/sex.enum";

/**
 * @description Payload para o endpoint POST /dependants (Adicionar Dependente)
 */
export interface AddDependantRequestDto {
  firstName: string;
  lastName: string;
  birthdate: string;
  relationship: DependantRelationship;
  sex: Sex;
  email?: string;
  phone?: string;
}

/**
 * @description Payload para o endpoint PATCH /dependants/{id} (Atualizar Dependente)
 */
export type UpdateDependantRequestDto = Partial<AddDependantRequestDto>;

/**
 * @description Resposta da API para um único dependente.
 * @source openapi.json - DependantDto
 */
export interface DependantResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  familyId: string;
  relationship: DependantRelationship;
  sex: Sex;
  birthdate: string; // A API retorna como string (ISODate)
  email?: string | null;
  phone?: string | null;
}