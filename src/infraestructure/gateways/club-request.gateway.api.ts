import {CreateClubRequestDto, ClubRequestStatusDto} from "@/contracts/api/club-management.dto";
import {ClubRequestGateway} from "@/application/gateways/club-request.gateway";
import {NextKeys} from "@/infraestructure/cache/next-keys";
import {RejectRequestDto} from "@/contracts/api/club-request.dto";

export class ClubRequestGatewayApi implements ClubRequestGateway {
  constructor(
      private readonly baseUrl: string,
      private readonly accessToken: string
  ) {
  }

  async create(dto: CreateClubRequestDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/club-requests`, {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(dto)
    });
    if (!res.ok && res.status !== 202) {
      const body = await res.json()
      throw new Error(body.message);
    }
  }

  async getMyRequests(): Promise<ClubRequestStatusDto[]> {
    const res = await fetch(`${this.baseUrl}/club-requests/my-requests`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      cache : 'no-store', // Dados de solicitações devem ser sempre frescos.
    });
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.message);
    }
    return res.json();
  }

  async getPending(): Promise<ClubRequestStatusDto[]> {
    const res = await fetch(`${this.baseUrl}/club-requests/pending`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next : {
        revalidate : 300, // Cache de 5 minutos para solicitações pendentes
        tags : [NextKeys.clubRequests.admin.pending],
      },
    });
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.message);
    }
    return res.json();
  }

  async approve(requestId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/club-requests/${requestId}/approve`, {
      method : 'POST',
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
    });
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.message);
    }
  }

  async reject(requestId: string, dto: RejectRequestDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/club-requests/${requestId}/reject`, {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(dto)
    });
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.message);
    }
  }
}
