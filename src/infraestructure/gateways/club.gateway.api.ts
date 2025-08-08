import {ClubGateway} from "@/application/gateways/club.gateway";
import {Club} from "@/domain/entities/entities";

export class ClubGatewayApi implements ClubGateway {
  constructor(
      private readonly baseUrl: string,
      private readonly accessToken: string
  ) {
  }

  async myClub(): Promise<Club> {
    const res = await fetch(`${this.baseUrl}/club-management/my-club`, {
      headers: {'Authorization': `Bearer ${this.accessToken}`},
      cache: 'no-store', 
    });
    if (!res.ok) throw new Error('Falha ao buscar dados do clube.');
    return res.json();
  }
}
