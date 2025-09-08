import { UserRoles } from '@/domain/enums/user.roles';

import { PaginatedResponseDto, PaginationDto } from './pagination.dto';
import { ClubMemberDto } from './club-member.dto';

export interface ManageUserRoleDto {
  roles: UserRoles[];
}

export interface ChangePrincipalDto {
  newPrincipalId: string;
}

export interface UpdateClubByAdminDto {
  name?: string;
  maxMembers?: number | null;
  address?: {
    city?: string;
    state?: string;
  };
}

export interface SearchClubMembersFilterDto {
  name?: string;
}

export interface SearchClubMembersQueryDto {
  clubId: string;
  filter?: SearchClubMembersFilterDto;
  pagination?: PaginationDto;
}

export type PaginatedClubMemberDto = PaginatedResponseDto<ClubMemberDto>;
