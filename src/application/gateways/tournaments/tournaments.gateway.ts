import {
  CreateTournamentDto,
  SearchTournamentsQuery,
  SearchTournamentsView,
  TournamentDetailsView,
  TournamentResponseDto,
  UpdateTournamentDto,
} from '@/contracts/api/tournament.dto';

export interface TournamentsGateway {
  searchTournaments(query: SearchTournamentsQuery): Promise<SearchTournamentsView>;
  getById(id: string): Promise<TournamentDetailsView>;
  create(dto: CreateTournamentDto): Promise<TournamentResponseDto>;
  update(id: string, dto: UpdateTournamentDto): Promise<TournamentResponseDto>;
  delete(id: string): Promise<void>;
}
