import {Club, Family, User} from "@/domain/entities/entities";
import {EnrollmentRequest} from "@/domain/entities/enrollment-request.entity";
import {ChangePrincipalDto} from "@/contracts/api/admin.dto";
import {SearchUsersQuery, PaginatedUsersDto} from "@/contracts/api/user.dto";

export interface AdminGateway {
  getAffiliations(): Promise<Family[]>;

  getEnrollments(): Promise<EnrollmentRequest[]>;

  getClubs(): Promise<Club[]>;

  getUsers(): Promise<User[]>;

  getUserById(userId: string): Promise<User>;

  searchUsers(query: SearchUsersQuery): Promise<PaginatedUsersDto>;

  changeClubPrincipal(clubId: string, data: ChangePrincipalDto): Promise<void>;
}
