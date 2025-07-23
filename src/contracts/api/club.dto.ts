// src/contracts/api/club.dto.ts

/**
 * @description Schema para os dados de um clube.
 * @source openapi.json - components.schemas.ClubDto
 */
export interface ClubDto {
  id: string;
  name: string;
  city: string;
  state: string;
  corum: number;
  createdAt: Date;
  principalId: string;
}

/**
 * @description Schema para a resposta paginada do endpoint GET /club.
 * @source openapi.json - components.schemas.PaginatedClubDto
 */
export interface PaginatedClubDto {
  data: ClubDto[];
  meta: {
    totalPages: number;
    total: number;
    limit: number;
    page: number;
  };
}

/**
 * @description Parâmetros de query para a busca de clubes.
 */
export interface SearchClubsQuery {
  name?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}