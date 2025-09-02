import { EnrollmentStatus } from '@/domain/enums/enrollment-status.enum';

export class EnrollmentRequest {
  constructor(
    readonly id: string,
    readonly clubId: string,
    readonly status: EnrollmentStatus,
    readonly familyId: string,
    readonly memberId: string,
    readonly resolvedAt: Date | null,
    readonly requestedAt: Date,
    readonly rejectionReason: string | null,
  ) {}
}
