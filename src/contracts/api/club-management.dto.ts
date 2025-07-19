// src/contracts/api/club-management.dto.ts

import {ClubDto} from "@/contracts/api/club.dto";

/**
 * @description Payload para o endpoint POST /club (Criar Clube)
 * @source openapi.json - components.schemas.CreateClubDto
 */
export interface CreateClubDto {
  name: string;
  city: string;
  state: string;
}

/**
 * @description Payload para o endpoint PATCH /club-management/{clubId} (Atualizar Clube)
 * @source openapi.json - components.schemas.UpdateClubDto
 */
export interface UpdateClubDto {
  name?: string;
  city?: string;
  state?: string;
}

/**
 * @description Payload para o endpoint POST /club-management/enrollments/{enrollmentId}/reject
 * @source openapi.json - components.schemas.RejectEnrollmentDto
 */
export interface RejectEnrollmentDto {
  reason: string;
}

/**
 * @description Payload para o endpoint POST /club (Criar Clube)
 */
export interface CreateClubDto {
  name: string;
  city: string;
  state: string;
}

/**
 * @description Resposta de sucesso do endpoint POST /club, que agora inclui novos tokens.
 */
export interface CreateClubResponseDto {
  club: ClubDto;
  accessToken: string;
  refreshToken: string;
}