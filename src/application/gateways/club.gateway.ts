import {Club} from "@/domain/entities/entities";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";
import {UpdateClubDto} from "@/contracts/api/club-management.dto";
import {ClubMemberDto} from "@/contracts/api/club-member.dto";

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
   * Busca histórico de matrículas do clube
   * OpenAPI: GET /clubs/{clubId}/enrollment-history
   */
  getEnrollmentHistory(clubId: string): Promise<any[]>;

  /**
   * Revoga membership de um membro
   * OpenAPI: DELETE /clubs/{clubId}/members/{memberId}
   */
  revokeMembership(clubId: string, memberId: string): Promise<void>;

  /**
   * Aprova uma matrícula pendente
   * OpenAPI: POST /clubs/{clubId}/enrollments/{enrollmentId}/approve
   */
  approveEnrollment(clubId: string, enrollmentId: string): Promise<void>;

  /**
   * Rejeita uma matrícula pendente
   * OpenAPI: POST /clubs/{clubId}/enrollments/{enrollmentId}/reject
   */
  rejectEnrollment(clubId: string, enrollmentId: string, payload: { rejectionReason: string }): Promise<void>;

  /**
   * Busca matrículas pendentes do clube
   * OpenAPI: GET /clubs/{clubId}/enrollments/pending
   */
  getPendingEnrollments(clubId: string): Promise<any[]>;
}
