import {Sex} from '@/domain/enums/sex.enum';

import { PaginatedResponseDto, PaginationDto } from './pagination.dto';

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

export interface SearchMyClubMembersFilterDto {
  name?: string;
}

export interface SearchMyClubMembersQuery {
  filter?: SearchMyClubMembersFilterDto;
  pagination?: PaginationDto;
}

export type SearchMyClubMembersView = PaginatedResponseDto<ClubMemberDto>;
