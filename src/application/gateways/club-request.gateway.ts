import { CreateClubRequestDto, ClubRequestStatusDto } from '@/contracts/api/club-management.dto';
import { RejectRequestDto } from '@/contracts/api/club-request.dto';

export interface ClubRequestGateway {
  getMyRequests(): Promise<ClubRequestStatusDto[]>;
  getPending(): Promise<ClubRequestStatusDto[]>;
  approve(requestId: string): Promise<void>;
  create(dto: CreateClubRequestDto): Promise<void>;
  reject(requestId: string, dto: RejectRequestDto): Promise<void>;
}
