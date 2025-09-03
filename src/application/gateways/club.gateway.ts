import { Club } from '@/domain/entities/entities';

import { ClubMemberDto, SearchMyClubMembersQueryDto, PaginatedMyClubMemberDto } from '@/contracts/api/club-member.dto';
import { UpdateClubDto, RejectEnrollmentDto } from '@/contracts/api/club-management.dto';
import { PaginatedClubDto, SearchClubsQuery } from '@/contracts/api/club.dto';
import { PendingEnrollmentDto } from '@/contracts/api/enrollment.dto';

export interface ClubGateway {
  getMyClubPendingEnrollments(): Promise<PendingEnrollmentDto[]>;
  getPendingEnrollments(clubId: string): Promise<any[]>;
  getEnrollmentHistory(clubId: string): Promise<any[]>;
  approveEnrollment(enrollmentId: string): Promise<void>;
  revokeMembership(membershipId: string): Promise<void>;
  rejectEnrollment(enrollmentId: string, payload: RejectEnrollmentDto): Promise<void>;
  getMyClubMembers(query?: SearchMyClubMembersQueryDto): Promise<PaginatedMyClubMemberDto>;
  updateMyClub(payload: UpdateClubDto): Promise<Club>;
  getMembers(clubId: string): Promise<ClubMemberDto[]>;
  getById(clubId: string): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  myClub(): Promise<Club | null>;
}
