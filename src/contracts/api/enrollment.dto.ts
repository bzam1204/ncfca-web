import { EnrollmentStatus } from '@/domain/enums/enrollment-status.enum';

export interface RequestEnrollmentDto {
  dependantId: string;
  clubId: string;
}

export interface EnrollmentRequestDto {
  id: string;
  status: EnrollmentStatus;
  clubId: string;
  familyId: string;
  dependantId: string;
  requestedAt: string;
  resolvedAt: string | null;
  rejectionReason: string | null;
}

export interface PendingEnrollmentDto {
  id: string;
  status: EnrollmentStatus;
  clubId: string;
  familyId: string;
  resolvedAt: string | null;
  dependantId: string;
  requestedAt: string;
  dependantName: string;
  rejectionReason: string | null;
}

// OpenAPI-aligned DTOs for MyClub pending enrollment requests
// Source: openapi.json -> components.schemas.FindMyClubPendingEnrollmentRequestsItemView
export interface FindMyClubPendingEnrollmentRequestsItemView {
  id: string;
  status: EnrollmentStatus;
  clubId: string;
  familyId: string;
  dependantId: string;
  dependantName: string;
  requestedAt: string;
  resolvedAt: string | null;
  rejectionReason: string | null;
}

// Source: openapi.json -> components.schemas.FindMyClubPendingEnrollmentRequestsView
export interface FindMyClubPendingEnrollmentRequestsView {
  data: FindMyClubPendingEnrollmentRequestsItemView[];
}
