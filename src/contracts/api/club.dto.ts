// src/contracts/api/club.dto.ts

/**
 * @description Schema para os dados de um clube.
 * @source openapi.json - components.schemas.ClubDto
 */
export interface ClubDto {
  id: string;
  name: string;
  city: string;
  principalId: string;
  // O schema no openapi.json não inclui state ou status, aderimos estritamente ao contrato.
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