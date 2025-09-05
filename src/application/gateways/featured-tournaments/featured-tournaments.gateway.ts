import { FeaturedTournamentResponseDto } from '@/contracts/api/tournament.dto';

export interface FeaturedTournamentsGateway {
  listFeatured(): Promise<FeaturedTournamentResponseDto[]>;
}
