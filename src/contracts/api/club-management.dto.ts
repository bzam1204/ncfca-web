// src/contracts/api/club-management.dto.ts

import {ClubDto} from "@/contracts/api/club.dto";
import {AddressDto} from "@/contracts/api/user.dto";

export interface CreateClubDto {
  name: string;
  city: string;
  state: string;
}

export interface CreateClubRequestDto {
  clubName: string;
  maxMembers: number;
  address: AddressDto;
}

export interface ClubRequestStatusDto {
  id: string;
  clubName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  resolvedAt?: any;
  rejectionReason?: any;
}

export interface UpdateClubDto {
  name?: string;
  city?: string;
  state?: string;
}

export interface RejectEnrollmentDto {
  reason: string;
}

export interface CreateClubResponseDto {
  club: ClubDto;
  accessToken: string;
  refreshToken: string;
}