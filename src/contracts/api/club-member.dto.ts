import {Sex} from '@/domain/enums/sex.enum';

export interface HolderDto {
  id: string;
  email: string;
  phone: string;
  lastName: string;
  firstName: string;
}

export interface ClubMemberDto {
  id: string;
  sex: Sex;
  email: string;
  phone: string;
  holder: HolderDto;
  lastName: string;
  firstName: string;
  birthDate: string;
  memberSince: string;
}
