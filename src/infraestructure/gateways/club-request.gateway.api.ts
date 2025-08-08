import {CreateClubRequestDto, ClubRequestStatusDto} from "@/contracts/api/club-management.dto";
import {ClubRequestGateway} from "@/application/gateways/club-request.gateway";

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

    // 202 Accepted é sucesso para esta rota.
    if (!res.ok && res.status !== 202) {
      throw new Error('Falha ao solicitar criação de clube.');
    }
  }

  async getMyRequests(): Promise<ClubRequestStatusDto[]> {
    const res = await fetch(`${this.baseUrl}/club-requests/my-requests`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      cache : 'no-store', // Dados de solicitações devem ser sempre frescos.
    });
    if (!res.ok) throw new Error('Falha ao buscar solicitações de clube.');
    return res.json();
  }
}
