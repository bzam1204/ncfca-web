import { Club } from '@/domain/entities/entities';

import { ClubGateway } from '@/application/gateways/club.gateway';

import { ClubMemberDto, SearchMyClubMembersQueryDto, PaginatedMyClubMemberDto } from '@/contracts/api/club-member.dto';
import { PaginatedClubDto, SearchClubsQuery } from '@/contracts/api/club.dto';
import { UpdateClubDto, RejectEnrollmentDto } from '@/contracts/api/club-management.dto';
import { PendingEnrollmentDto } from '@/contracts/api/enrollment.dto';

export class ClubGatewayApi implements ClubGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async myClub(): Promise<Club | null> {
    const res = await fetch(`${this.baseUrl}/my-club`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  }

  async search(query: SearchClubsQuery): Promise<PaginatedClubDto> {
    const params = new URLSearchParams();
    if (query.name) params.append('filter[name]', query.name);
    if (query.city) params.append('filter[city]', query.city);
    if (query.state) params.append('filter[state]', query.state);
    params.append('pagination[page]', query.page?.toString() || '1');
    params.append('pagination[limit]', query.limit?.toString() || '6');
    const res = await fetch(`${this.baseUrl}/club?${params.toString()}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message);
    }
    return res.json();
  }

  async getById(clubId: string): Promise<Club> {
    try {
      const res = await fetch(`${this.baseUrl}/club/${clubId}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message);
      }
      return res.json();
    } catch (error) {
      throw error;
    }
  }

  async updateMyClub(payload: UpdateClubDto): Promise<Club> {
    const res = await fetch(`${this.baseUrl}/my-club`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Falha ao atualizar clube.');
    }
    return res.json();
  }

  async getMembers(clubId: string): Promise<ClubMemberDto[]> {
    const res = await fetch(`${this.baseUrl}/my-club/members`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar membros do clube');
    }
    return res.json();
  }

  async getEnrollmentHistory(clubId: string): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/my-club/enrollments`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar histórico de matrículas');
    }
    return res.json();
  }

  async getMyClubMembers(query?: SearchMyClubMembersQueryDto): Promise<PaginatedMyClubMemberDto> {
    const params = new URLSearchParams();

    if (query?.pagination?.page) {
      params.append('pagination[page]', query.pagination.page.toString());
    }
    if (query?.pagination?.limit) {
      params.append('pagination[limit]', query.pagination.limit.toString());
    }
    if (query?.filter?.name) {
      params.append('filter[name]', query.filter.name);
    }

    const url = `${this.baseUrl}/my-club/members${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar membros do meu clube');
    }
    return res.json();
  }

  async revokeMembership(membershipId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/membership/${membershipId}/revoke`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao revogar membership');
    }
  }

  async approveEnrollment(enrollmentId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/enrollments/${enrollmentId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao aprovar matrícula');
    }
  }

  async rejectEnrollment(enrollmentId: string, payload: RejectEnrollmentDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/enrollments/${enrollmentId}/reject`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao rejeitar matrícula');
    }
  }

  async getPendingEnrollments(clubId: string): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/my-club/enrollments/pending`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar matrículas pendentes');
    }
    return res.json();
  }

  async getMyClubPendingEnrollments(): Promise<PendingEnrollmentDto[]> {
    const res = await fetch(`${this.baseUrl}/my-club/enrollments/pending`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar matrículas pendentes do meu clube');
    }
    return res.json();
  }
}
