import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {Sex} from "@/domain/enums/sex.enum";
import {HolderDto} from "@/contracts/api/club-member.dto";

export interface AddDependantRequestDto {
  firstName: string;
  lastName: string;
  birthdate: string;
  relationship: DependantRelationship;
  sex: Sex;
  email?: string;
  phone?: string;
}

export type UpdateDependantRequestDto = Partial<AddDependantRequestDto>;

export interface DependantResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  familyId: string;
  relationship: DependantRelationship;
  sex: Sex;
  birthdate: string;
  email?: string | null;
  phone?: string | null;
}

export interface DependantDetailsDto {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: Sex;
  avatarUrl: string | null;
  holder: HolderDto;
}
