import { PaginationDto } from './pagination.dto';

/**
 * @description Tipos de torneio disponíveis.
 * @source openapi.json - components.schemas.SearchTournamentsItemView.properties.type.enum
 */
export type TournamentType = 'INDIVIDUAL' | 'DUO';

/**
 * @description Schema para item de torneio na listagem de busca.
 * @source openapi.json - components.schemas.SearchTournamentsItemView
 */
export interface SearchTournamentsItemView {
  /** ID único do torneio */
  id: string;
  /** Nome do torneio */
  name: string;
  /** Tipo do torneio */
  type: TournamentType;
  /** Data de início do torneio */
  startDate: string;
  /** Número de inscrições no torneio */
  registrationCount: number;
  /** Data de fim das inscrições */
  registrationEndDate: string;
  /** Data de início das inscrições */
  registrationStartDate: string;
}

/**
 * @description Schema para resposta paginada da busca de torneios.
 * @source openapi.json - components.schemas.SearchTournamentsView
 */
export interface SearchTournamentsView {
  data: SearchTournamentsItemView[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * @description Filtros para busca de torneios.
 * @source openapi.json - components.schemas.SearchTournamentFilter
 */
export interface SearchTournamentFilter {
  /** Filtro por nome do torneio */
  name?: string;
  /** Filtro por tipo de torneio */
  type?: TournamentType;
  /** Mostrar torneios excluídos */
  showDeleted?: boolean;
}

/**
 * @description Query completa para busca de torneios.
 * @source openapi.json - components.schemas.SearchTournamentsQuery
 */
export interface SearchTournamentsQuery {
  /** Filtros de busca */
  filter?: SearchTournamentFilter;
  /** Parâmetros de paginação */
  pagination?: PaginationDto;
}

/**
 * @description Schema para detalhes completos de um torneio.
 * @source openapi.json - components.schemas.TournamentDetailsView
 */
export interface TournamentDetailsView {
  /** ID único do torneio */
  id: string;
  /** Nome do torneio */
  name: string;
  /** Tipo do torneio */
  type: TournamentType;
  /** Data de criação do torneio */
  createdAt: string;
  /** Data de início do torneio */
  startDate: string;
  /** Data de exclusão do torneio (soft delete) */
  deletedAt?: string;
  /** Descrição detalhada do torneio */
  description: string;
  /** Número de inscrições no torneio */
  registrationCount: number;
  /** Data de fim das inscrições */
  registrationEndDate: string;
  /** Data de início das inscrições */
  registrationStartDate: string;
}

/**
 * @description Schema para torneio em destaque no carrossel.
 * @source openapi.json - components.schemas.FeaturedTournamentResponseDto
 */
export interface FeaturedTournamentResponseDto {
  /** ID do destaque */
  id: string;
  /** ID do torneio destacado */
  tournamentId: string;
  /** Posição no carrossel (única) */
  position: number;
  /** Data de criação */
  createdAt: string;
  /** Data da última atualização */
  updatedAt: string;
  /** Nome do torneio */
  tournamentName: string;
  /** Tipo do torneio */
  tournamentType: TournamentType;
  /** Data de início do torneio */
  startDate: string;
  /** Data de início das inscrições */
  registrationStartDate: string;
  /** Data de fim das inscrições */
  registrationEndDate: string;
}