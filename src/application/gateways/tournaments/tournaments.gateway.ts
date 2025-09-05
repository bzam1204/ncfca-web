import { SearchTournamentsQuery, SearchTournamentsView, TournamentDetailsView } from '@/contracts/api/tournament.dto';

export interface TournamentsGateway {
  searchTournaments(query: SearchTournamentsQuery): Promise<SearchTournamentsView>;
  getById(id: string): Promise<TournamentDetailsView>;
}