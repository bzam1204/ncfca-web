// src/contracts/api/family.dto.ts

import {FamilyStatus} from "@/domain/enums/family-status.enum";

/**
 * @description Resposta da API para o endpoint GET /dependants/my-family.
 * @source openapi.json - components.schemas.FamilyDto
 */
export interface FamilyResponseDto {
  id: string;
  holderId: string;
  status: FamilyStatus;
  affiliatedAt: string | null; // Datas em JSON são strings no formato ISO
  affiliationExpiresAt: string | null;
  // O openapi.json especifica um array de strings (IDs), não objetos completos.
  dependants: string[];
}