import { CreateClubRequestDto, ClubRequestStatusDto } from "@/contracts/api/club-management.dto";

export interface ClubRequestGateway {
  getMyRequests(): Promise<ClubRequestStatusDto[]>;
  create(dto: CreateClubRequestDto): Promise<void>;
}
