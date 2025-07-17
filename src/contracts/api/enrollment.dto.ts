// src/contracts/api/enrollment.dto.ts


import {EnrollmentStatus} from "@/domain/enums/enrollment-status.enum";

/**
 * @description Payload para o endpoint POST /enrollments (Solicitar Matrícula)
 * @source openapi.json - components.schemas.RequestEnrollmentDto
 */
export interface RequestEnrollmentDto {
  dependantId: string;
  clubId: string;
}

/**
 * @description Schema para uma solicitação de matrícula.
 * @source openapi.json - components.schemas.EnrollmentRequestDto
 */
export interface EnrollmentRequestDto {
  id: string;
  status: EnrollmentStatus;
  clubId: string;
  familyId: string;
  dependantId: string; // Corrigido de 'dependantId' para 'dependantId' para consistência
  requestedAt: string;
  resolvedAt: string | null;
  rejectionReason: string | null; // A API define como objeto, mas string é mais provável. Ajustar se necessário.
}
