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