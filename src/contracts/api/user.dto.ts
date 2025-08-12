import {UserRoles} from "@/domain/enums/user.roles";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  roles: UserRoles[];
  address: AddressDto;
}

export interface AddressDto {
  district: string;
  zipCode: string;
  street: string;
  number: string;
  state: string;
  city: string;
}

/**
 * @description Query parameters for searching users.
 */
export interface SearchUsersQuery {
  name?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  role?: UserRoles;
  page?: number;
  limit?: number;
}

/**
 * @description Paginated response for user search.
 */
export interface PaginatedUsersDto {
  data: UserDto[];
  meta: {
    totalPages: number;
    total: number;
    limit: number;
    page: number;
  };
}