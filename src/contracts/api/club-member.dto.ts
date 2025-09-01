import { Sex } from '@/domain/enums/sex.enum';

export interface HolderDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface ClubMemberDto {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  holder: HolderDto;
  memberSince: string;
  birthDate: string;
  sex: Sex;
}
