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
  getAffiliations(): Promise<AffiliationDto[]>;

  getEnrollments(): Promise<EnrollmentRequest[]>;

  getClubs(): Promise<Club[]>;

  getUsers(): Promise<User[]>;

  getUserById(userId: string): Promise<User>;

  searchUsers(query: SearchUsersQuery): Promise<PaginatedUsersDto>;

  changeClubPrincipal(clubId: string, data: ChangePrincipalDto): Promise<void>;

  updateClub(clubId: string, payload: UpdateClubByAdminDto): Promise<Club>;

  /**
   * Retorna uma lista paginada de todos os membros ativos de um clube
   * OpenAPI: GET /admin/clubs/members
   */
  getClubMembers(query: SearchClubMembersQueryDto): Promise<PaginatedClubMemberDto>;

  getClubCharts(clubId: string): Promise<AdminClubChartsDto>;

  approveEnrollment(clubId: string, enrollmentId: string): Promise<void>;

  rejectEnrollment(clubId: string, enrollmentId: string, payload?: { rejectionReason?: string }): Promise<void>;

  getUserFamily(userId: string): Promise<{ user: UserDto; family: FamilyResponseDto }>;

  getClubEnrollmentsPending(clubId: string): Promise<PendingEnrollmentDto[]>;

  /**
   * Gerencia os perfis/roles de um usuário
   * OpenAPI: PATCH /admin/users/{userId}/roles
   */
  manageUserRole(userId: string, data: ManageUserRoleDto): Promise<void>;
}
