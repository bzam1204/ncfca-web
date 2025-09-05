import { TournamentsGateway } from '@/application/gateways/tournaments/tournaments.gateway';

import { SearchTournamentsQuery, SearchTournamentsView, TournamentDetailsView } from '@/contracts/api/tournament.dto';

import { NextKeys } from '../cache/next-keys';

export class TournamentsGatewayApi implements TournamentsGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async searchTournaments(query: SearchTournamentsQuery): Promise<SearchTournamentsView> {
    const params = new URLSearchParams();
    
    if (query.filter?.name) {
      params.append('filter[name]', query.filter.name);
    }
    if (query.filter?.type) {
      params.append('filter[type]', query.filter.type);
    }
    if (query.filter?.showDeleted !== undefined) {
      params.append('filter[showDeleted]', query.filter.showDeleted.toString());
    }
    if (query.pagination?.page) {
      params.append('pagination[page]', query.pagination.page.toString());
    }
    if (query.pagination?.limit) {
      params.append('pagination[limit]', query.pagination.limit.toString());
    }

    const url = `${this.baseUrl}/tournaments${params.toString() ? `?${params.toString()}` : ''}`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      next: {
        revalidate: 300,
        tags: [NextKeys.tournaments.search(query)],
      },
    });
    
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar torneios');
    }
    
    return res.json();
  }

  async getById(id: string): Promise<TournamentDetailsView> {
    const res = await fetch(`${this.baseUrl}/tournaments/${id}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      next: {
        revalidate: 300,
        tags: [NextKeys.tournaments.details(id)],
      },
    });
    
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar detalhes do torneio');
    }
    
    return res.json();
  }
}