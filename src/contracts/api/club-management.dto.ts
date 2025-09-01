// src/contracts/api/club-management.dto.ts

import {AddressDto} from "@/contracts/api/user.dto";
import {Club} from "@/domain/entities/entities";

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
  maxMembers?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  address: AddressDto;
  requesterId: string;
  requestedAt: string;
  resolvedAt?: any;
  rejectionReason?: any;
}

export interface UpdateClubDto {
  name?: string;
  maxMembers?: number | null;
  address?: AddressDto;
}

export interface RejectEnrollmentDto {
  rejectionReason: string;
}

export interface CreateClubResponseDto {
  club: Club;
  accessToken: string;
  refreshToken: string;
}