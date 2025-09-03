import { Club, User } from '@/domain/entities/entities';
import { EnrollmentRequest } from '@/domain/entities/enrollment-request.entity';
import {
  ChangePrincipalDto,
  UpdateClubByAdminDto,
  ManageUserRoleDto,
  SearchClubMembersQueryDto,
  PaginatedClubMemberDto,
} from '@/contracts/api/admin.dto';
import { SearchUsersQuery, PaginatedUsersDto, UserDto } from '@/contracts/api/user.dto';
import { AdminClubChartsDto } from '@/contracts/api/admin-charts.dto';
import { FamilyResponseDto } from '@/contracts/api/family.dto';
import { PendingEnrollmentDto } from '@/contracts/api/enrollment.dto';
import { AffiliationDto } from '@/contracts/api/affiliation.dto';

export interface AdminGateway {
  getClubs(): Promise<Club[]>;
  getUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User>;
  searchUsers(query: SearchUsersQuery): Promise<PaginatedUsersDto>;
  updateClub(clubId: string, payload: UpdateClubByAdminDto): Promise<Club>;
  getClubCharts(clubId: string): Promise<AdminClubChartsDto>;
  getUserFamily(userId: string): Promise<{ user: UserDto; family: FamilyResponseDto }>;
  getEnrollments(): Promise<EnrollmentRequest[]>;
  manageUserRole(userId: string, data: ManageUserRoleDto): Promise<void>;
  getAffiliations(): Promise<AffiliationDto[]>;
  rejectEnrollment(clubId: string, enrollmentId: string, payload?: { rejectionReason?: string }): Promise<void>;
  approveEnrollment(clubId: string, enrollmentId: string): Promise<void>;
  changeClubPrincipal(clubId: string, data: ChangePrincipalDto): Promise<void>;
  searchClubMembersToAdmin(query: SearchClubMembersQueryDto): Promise<PaginatedClubMemberDto>;
  getClubEnrollmentsPending(clubId: string): Promise<PendingEnrollmentDto[]>;
}
