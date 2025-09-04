import { Club } from '@/domain/entities/entities';

import { ClubMemberDto, SearchMyClubMembersQuery, SearchMyClubMembersView } from '@/contracts/api/club-member.dto';
import { UpdateClubDto, RejectEnrollmentDto } from '@/contracts/api/club-management.dto';
import { PaginatedClubDto, SearchClubsQuery } from '@/contracts/api/club.dto';
import { PendingEnrollmentDto, FindMyClubPendingEnrollmentRequestsView, FindMyClubEnrollmentRequestsView } from '@/contracts/api/enrollment.dto';

export interface ClubGateway {
  findMyClubPendingEnrollmentRequests(): Promise<FindMyClubPendingEnrollmentRequestsView>;
  getMyClubPendingEnrollments(): Promise<PendingEnrollmentDto[]>;
  approveEnrollmentRequest(enrollmentRequestId: string): Promise<void>;
  rejectEnrollmentRequest(enrollmentRequestId: string, payload: RejectEnrollmentDto): Promise<void>;
  // OpenAPI aligned method name and return type
  findMyClubEnrollmentRequests(): Promise<FindMyClubEnrollmentRequestsView>;
  revokeMembership(membershipId: string): Promise<void>;
  searchMyClubMembers(query?: SearchMyClubMembersQuery): Promise<SearchMyClubMembersView>;
  updateMyClub(payload: UpdateClubDto): Promise<Club>;
  getMembers(clubId: string): Promise<ClubMemberDto[]>;
  getById(clubId: string): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  myClub(): Promise<Club | null>;
}
