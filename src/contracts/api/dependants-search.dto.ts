/**
 * @description Filtros para busca de dependentes.
 * @source openapi.json - components.schemas.SearchDependantsFilter
 */
export interface SearchDependantsFilter {
  /** Filtro por email do dependente (parcial, case-insensitive) */
  email?: string;
}

/**
 * @description Schema para item de dependente na busca.
 * @source openapi.json - components.schemas.DependantsItemView
 */
export interface DependantsItemView {
  /** ID único do dependente */
  id: string;
  /** Nome completo do dependente */
  name: string;
  /** Email do dependente */
  email: string;
}

/**
 * @description Schema para resposta paginada da busca de dependentes.
 * @source openapi.json - components.schemas.SearchDependantsView
 */
export interface SearchDependantsView {
  data: DependantsItemView[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}