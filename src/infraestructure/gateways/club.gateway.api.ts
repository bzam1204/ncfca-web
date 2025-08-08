import {Club} from "@/domain/entities/entities";

import {ClubGateway} from "@/application/gateways/club.gateway";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export class ClubGatewayApi implements ClubGateway {
  constructor(
      private readonly baseUrl: string,
      private readonly accessToken: string
  ) {
  }

  async myClub(): Promise<Club> {
    const res = await fetch(`${this.baseUrl}/club-management/my-club`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      cache : 'no-store',
    });
    if (!res.ok) throw new Error('Falha ao buscar dados do clube.');
    return res.json();
  }

  async search(query: SearchClubsQuery): Promise<PaginatedClubDto> {
    console.log({query}, 'recebendo query')
    const params = new URLSearchParams();
    if (query.name) params.append('filter[name]', query.name);
    if (query.city) params.append('filter[city]', query.city);
    if (query.state) params.append('filter[state]', query.state);
    params.append('pagination[page]', query.page?.toString() || '1');
    params.append('pagination[limit]', query.limit?.toString() || '6');
    const res = await fetch(`${this.baseUrl}/club?${params.toString()}`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
    });
    if (!res.ok) throw new Error('Falha ao buscar clubes.');
    return res.json();
  }

}
