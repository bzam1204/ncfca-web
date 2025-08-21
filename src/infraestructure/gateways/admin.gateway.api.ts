import {Club, User} from "@/domain/entities/entities";
import {EnrollmentRequest} from "@/domain/entities/enrollment-request.entity";

import {AdminGateway} from "@/application/gateways/admin.gateway";
import {ChangePrincipalDto, UpdateClubByAdminDto, ManageUserRoleDto} from "@/contracts/api/admin.dto";
import {SearchUsersQuery, PaginatedUsersDto, UserDto} from "@/contracts/api/user.dto";
import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {AdminClubChartsDto} from "@/contracts/api/admin-charts.dto";
import {FamilyResponseDto} from "@/contracts/api/family.dto";
import {PendingEnrollmentDto} from "@/contracts/api/enrollment.dto";
import {AffiliationDto} from "@/contracts/api/affiliation.dto";

import {NextKeys} from "@/infraestructure/cache/next-keys";

export class AdminGatewayApi implements AdminGateway {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly revalidateInSeconds: number = 600; // 10 minutos

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private async fetchData<T>(endpoint: string, tag: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/admin/${endpoint}`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next : {
        revalidate : this.revalidateInSeconds,
        tags : [tag],
      },
    });
    if (!res.ok) {
      throw new Error(`Falha ao buscar dados de /admin/${endpoint}`);
    }
    return res.json();
  }

  getAffiliations(): Promise<AffiliationDto[]> {
    return this.fetchData<AffiliationDto[]>('affiliations', NextKeys.admin.affiliations);
  }

  getClubs(): Promise<Club[]> {
    return this.fetchData<Club[]>('clubs', NextKeys.admin.clubs);
  }

  getEnrollments(): Promise<EnrollmentRequest[]> {
    return this.fetchData<EnrollmentRequest[]>('enrollments', NextKeys.admin.enrollments);
  }

  getUsers(): Promise<User[]> {
    return this.fetchData<User[]>('users', NextKeys.admin.users);
  }

  getUserById(userId: string): Promise<User> {
    return this.fetchData<User>(`users/${userId}`, NextKeys.admin.users);
  }

  async searchUsers(query: SearchUsersQuery): Promise<PaginatedUsersDto> {
    const params = new URLSearchParams();

    // Add filter parameters
    if (query.name) params.append('filter[name]', query.name);
    if (query.email) params.append('filter[email]', query.email);
    if (query.cpf) params.append('filter[cpf]', query.cpf);
    if (query.rg) params.append('filter[rg]', query.rg);
    if (query.role) params.append('filter[role]', query.role);

    // Add pagination parameters
    params.append('pagination[page]', query.page?.toString() || '1');
    params.append('pagination[limit]', query.limit?.toString() || '10');

    const res = await fetch(`${this.baseUrl}/admin/users?${params.toString()}`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next : {
        revalidate : this.revalidateInSeconds,
        tags : [NextKeys.admin.searchUsers],
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Falha ao buscar usuários`);
    }

    return res.json();
  }

  async changeClubPrincipal(clubId: string, data: ChangePrincipalDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/admin/clubs/${clubId}/director`, {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Falha ao alterar o principal do clube`);
    }
  }

  async updateClub(clubId: string, payload: UpdateClubByAdminDto): Promise<Club> {
    const res = await fetch(`${this.baseUrl}/admin/clubs/${clubId}`, {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao atualizar clube.');
    }

    return await res.json();
  }

  getClubMembers(clubId: string): Promise<ClubMemberDto[]> {
    return this.fetchData<{members: ClubMemberDto[]}>(`clubs/${clubId}/members`, NextKeys.admin.clubMembers(clubId))
      .then(response => response.members);
  }

  getClubCharts(clubId: string): Promise<AdminClubChartsDto> {
    return this.fetchData<AdminClubChartsDto>(`clubs/${clubId}/charts`, NextKeys.admin.clubCharts(clubId));
  }

  async approveEnrollment(clubId: string, enrollmentId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/admin/clubs/${clubId}/enrollments/${enrollmentId}/approve`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${this.accessToken}`},
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao aprovar matrícula');
    }
  }

  async rejectEnrollment(clubId: string, enrollmentId: string, payload?: { rejectionReason?: string }): Promise<void> {
    const res = await fetch(`${this.baseUrl}/admin/clubs/${clubId}/enrollments/${enrollmentId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao rejeitar matrícula');
    }
  }

  getUserFamily(userId: string): Promise<{ user: UserDto; family: FamilyResponseDto }> {
    return this.fetchData<{ user: UserDto; family: FamilyResponseDto }>(`users/${userId}/family`, NextKeys.admin.userFamily(userId));
  }

  getClubEnrollmentsPending(clubId: string): Promise<PendingEnrollmentDto[]> {
    return this.fetchData<PendingEnrollmentDto[]>(`clubs/${clubId}/enrollments/pending`, `admin.club_enrollments_pending.${clubId}`);
  }

  async manageUserRole(userId: string, data: ManageUserRoleDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/admin/users/${userId}/roles`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao gerenciar perfis do usuário');
    }
  }
}
