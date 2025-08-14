// src/contracts/api/admin.dto.ts
import {UserRoles} from "@/domain/enums/user.roles";

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
