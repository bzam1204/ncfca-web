import { Club } from '@/domain/entities/entities';

import { ClubMemberDto, SearchMyClubMembersQuery, SearchMyClubMembersView } from '@/contracts/api/club-member.dto';
import { UpdateClubDto, RejectEnrollmentDto } from '@/contracts/api/club-management.dto';
import { PaginatedClubDto, SearchClubsQuery } from '@/contracts/api/club.dto';
import { PendingEnrollmentDto, FindMyClubPendingEnrollmentRequestsView } from '@/contracts/api/enrollment.dto';

export interface ClubGateway {
  findMyClubPendingEnrollmentRequests(): Promise<FindMyClubPendingEnrollmentRequestsView>;
  getMyClubPendingEnrollments(): Promise<PendingEnrollmentDto[]>;
  getEnrollmentHistory(clubId: string): Promise<any[]>;
  /**
   * todo: the @openapi.json was update. the method signature should be updated to reflect the changes, also the implementation in ClubGatewayApi must be updated, and its usages.
   * see: src/infrastructure/gateways/club.gateway.api.ts
   * see: src/app/dashboard/_components/pending-enrollments-table.tsx
   */
  approveEnrollment(enrollmentId: string): Promise<void>;
  rejectEnrollment(enrollmentId: string, payload: RejectEnrollmentDto): Promise<void>;
  revokeMembership(membershipId: string): Promise<void>;
  searchMyClubMembers(query?: SearchMyClubMembersQuery): Promise<SearchMyClubMembersView>;
  updateMyClub(payload: UpdateClubDto): Promise<Club>;
  getMembers(clubId: string): Promise<ClubMemberDto[]>;
  getById(clubId: string): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  myClub(): Promise<Club | null>;
}
