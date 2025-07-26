import {ClubQuery} from "@/hooks/queries/club.query";
import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

export class ClubQueryApi implements ClubQuery {
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async searchClubs(query: SearchClubsQuery): Promise<PaginatedClubDto> {
    const params = new URLSearchParams();
    if (query.name) params.append('filter[name]', query.name);
    if (query.city) params.append('filter[city]', query.city);
    if (query.state) params.append('filter[state]', query.state);
    params.append('pagination[page]', query.page?.toString() || '1');
    params.append('pagination[limit]', query.limit?.toString() || '6');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/club?${params.toString()}`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`}
    });
    if (!res.ok) throw new Error('Falha ao buscar clubes.');
    return res.json();
  }

}
