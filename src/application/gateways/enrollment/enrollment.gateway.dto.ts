import {EnrollmentStatus} from "@/domain/enums/enrollment-status.enum";

export interface RequestEnrollmentDto {
  dependantId: string;
  clubId: string;
}

export interface MyEnrollmentRequestsDto {
  rejectionReason: string | null;
  dependantName: string;
  requestedAt: Date;
  resolvedAt: Date | null;
  clubName: string;
  status: EnrollmentStatus;
  id: string;
}