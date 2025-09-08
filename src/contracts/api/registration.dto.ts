import { TournamentType } from './tournament.dto';

/**
 * @description Status possíveis para uma inscrição.
 * @source openapi.json - components.schemas.SearchMyRegistrationsFilter.properties.status.enum
 */

export type RegistrationStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING_APPROVAL' | 'REJECTED';

/**
 * @description Filtros para busca de minhas inscrições.
 * @source openapi.json - components.schemas.SearchMyRegistrationsFilter
 */
export interface SearchMyRegistrationsFilter {
  /** Filtra por nome do torneio (busca parcial, case-insensitive) */
  tournamentName?: string;
  /** Filtra por status da inscrição */
  status?: RegistrationStatus;
  /** Ordenação por data de criação (asc ou desc) */
  order?: 'asc' | 'desc';
  /** Página atual para paginação (opcional) */
  page?: number;
  /** Limite de itens por página (opcional) */
  limit?: number;
}

/**
 * @description Schema para item de inscrição na listagem.
 * @source openapi.json - components.schemas.SearchMyRegistrationItemView
 */
export interface SearchMyRegistrationItemView {
  /** ID único da inscrição */
  registrationId: string;
  /** Nome do torneio */
  tournamentName: string;
  /** Tipo do torneio */
  tournamentType: TournamentType;
  /** Status da inscrição */
  status: RegistrationStatus;
  /** Nome do competidor principal */
  competitorName: string;
  /** ID do competidor principal */
  competitorId: string;
  /** Nome do parceiro (se houver) */
  partnerName?: string;
  /** ID do parceiro (se houver) */
  partnerId?: string;
  /** Data da solicitação */
  requestedAt: string;
}

/**
 * @description Schema para resposta paginada das minhas inscrições.
 * @source openapi.json - components.schemas.SearchMyRegistrationView
 */
export interface SearchMyRegistrationView {
  data: SearchMyRegistrationItemView[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * @description Schema para inscrições pendentes de aprovação.
 * @source openapi.json - components.schemas.GetMyPendingRegistrationsItemView
 */
export interface GetMyPendingRegistrationsListItemView {
  /** ID único da inscrição */
  registrationId: string;
  /** Nome do torneio */
  tournamentName: string;
  /** Nome do dependente solicitante */
  competitorName: string;
  /** ID do dependente solicitante */
  competitorId: string;
  /** Data da solicitação */
  requestedAt: string;
  /** Tipo do torneio */
  tournamentType: TournamentType;
}

/**
 * @description Input para solicitação de inscrição individual.
 * @source openapi.json - components.schemas.RequestIndividualRegistrationInputDto
 */
export interface RequestIndividualRegistrationInputDto {
  /** ID do torneio para o qual deseja se registrar */
  tournamentId: string;
  /** ID do competidor (dependente) que será registrado */
  competitorId: string;
}

/**
 * @description Output da solicitação de inscrição individual.
 * @source openapi.json - components.schemas.RequestIndividualRegistrationOutputDto
 */
export interface RequestIndividualRegistrationOutputDto {
  /** ID único da inscrição individual criada */
  registrationId: string;
  /** Status atual da inscrição individual */
  status: 'CONFIRMED';
}

/**
 * @description Input para solicitação de inscrição em dupla.
 * @source openapi.json - components.schemas.RequestDuoRegistrationDto
 */
export interface RequestDuoRegistrationDto {
  /** ID do torneio para o qual deseja se registrar a dupla */
  tournamentId: string;
  /** ID do competidor (dependente) que será registrado */
  competitorId: string;
  /** ID do parceiro (dependente) que será convidado para formar a dupla */
  partnerId: string;
}

/**
 * @description Output da solicitação de inscrição em dupla.
 * @source openapi.json - components.schemas.RequestDuoRegistrationOutputDto
 */
export interface RequestDuoRegistrationOutputDto {
  /** ID único da inscrição de dupla criada */
  registrationId: string;
  /** Status atual da inscrição da dupla */
  status: 'PENDING_APPROVAL';
}

/**
 * @description Input para cancelamento de inscrição.
 * @source openapi.json - components.schemas.CancelRegistrationDto
 */
export interface CancelRegistrationDto {
  /** ID da inscrição a ser cancelada */
  registrationId: string;
}
