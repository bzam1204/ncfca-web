export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
