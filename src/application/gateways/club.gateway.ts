import {Club} from "@/domain/entities/entities";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";
import {UpdateClubDto, RejectEnrollmentDto} from "@/contracts/api/club-management.dto";
import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {PendingEnrollmentDto} from "@/contracts/api/enrollment.dto";

export interface ClubGateway {
  myClub(): Promise<Club>;
  search(query: SearchClubsQuery): Promise<PaginatedClubDto>;
  getById(clubId: string): Promise<Club>;
  updateMyClub(payload: UpdateClubDto): Promise<Club>;

  /**
   * Busca membros do clube
   * OpenAPI: GET /clubs/{clubId}/members
   */
  getMembers(clubId: string): Promise<ClubMemberDto[]>;

  /**
   * Busca membros do meu clube
   * OpenAPI: GET /my-club/members
   */
  getMyClubMembers(): Promise<ClubMemberDto[]>;

  /**
   * Busca histórico de matrículas do clube
   * OpenAPI: GET /clubs/{clubId}/enrollment-history
   */
  getEnrollmentHistory(clubId: string): Promise<any[]>;

  /**
   * Revoga membership de um membro
   * OpenAPI: POST /membership/{membershipId}/revoke
   */
  revokeMembership(membershipId: string): Promise<void>;

  /**
   * Aprova uma matrícula pendente
   * OpenAPI: POST /enrollments/{enrollmentId}/approve
   */
  approveEnrollment(enrollmentId: string): Promise<void>;

  /**
   * Rejeita uma matrícula pendente
   * OpenAPI: POST /enrollments/{enrollmentId}/reject
   */
  rejectEnrollment(enrollmentId: string, payload: RejectEnrollmentDto): Promise<void>;

  /**
   * Busca matrículas pendentes do clube
   * OpenAPI: GET /clubs/{clubId}/enrollments/pending
   */
  getPendingEnrollments(clubId: string): Promise<any[]>;

  /**
   * Busca matrículas pendentes do meu clube
   * OpenAPI: GET /my-club/enrollments/pending
   */
  getMyClubPendingEnrollments(): Promise<PendingEnrollmentDto[]>;
}
