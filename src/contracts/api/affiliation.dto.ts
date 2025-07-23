// src/contracts/api/family.dto.ts

import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {UserDto} from "@/contracts/api/user.dto";
import {DependantResponseDto} from "@/contracts/api/dependant.dto";

export interface AffiliationDto {
  id: string;
  holderId: string;
  status: FamilyStatus;
  affiliatedAt: string | null;
  affiliationExpiresAt: string | null;
  holder: UserDto;
  dependants: DependantResponseDto[];
}