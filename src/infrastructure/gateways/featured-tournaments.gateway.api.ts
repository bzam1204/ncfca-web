import { FeaturedTournamentsGateway } from '@/application/gateways/featured-tournaments/featured-tournaments.gateway';

import { FeaturedTournamentResponseDto } from '@/contracts/api/tournament.dto';

import { NextKeys } from '../cache/next-keys';

export class FeaturedTournamentsGatewayApi implements FeaturedTournamentsGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async listFeatured(): Promise<FeaturedTournamentResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/featured-tournaments`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      next: {
        revalidate: 300,
        tags: [NextKeys.featuredTournaments.list],
      },
    });
    
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar torneios em destaque');
    }
    
    return res.json();
  }
}