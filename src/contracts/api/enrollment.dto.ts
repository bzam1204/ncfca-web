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
  dependantId: string;
  requestedAt: string; // Formato ISODate
  resolvedAt: string | null;
  // O contrato atualizado define 'rejectionReason' como objeto, o que é estranho.
  // Assumirei que é um erro na documentação e o tratarei como string.
  rejectionReason: string | null;
}