// src/contracts/api/club-management.dto.ts

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