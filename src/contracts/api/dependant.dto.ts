import { DependantRelationship } from '@/domain/enums/dependant-relationship.enum';
import { Sex } from '@/domain/enums/sex.enum';
import { HolderDto } from '@/contracts/api/club-member.dto';
import { DependantType } from '@/domain/enums/dependant-type.enum';

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

export interface DependantDetailsDto {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: Sex;
  avatarUrl: string | null;
  holder: HolderDto;
}

export interface DependantDto {
  readonly id: string;
  readonly sex: Sex;
  readonly type: DependantType;
  readonly email: string;
  readonly phone: string | null;
  readonly familyId: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly birthdate: Date;
  readonly relationship: DependantRelationship;
}
