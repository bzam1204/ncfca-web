/**
 * @file Contratos de DTO (Data Transfer Object) para a API de Autenticação.
 * @description Esta é a única fonte da verdade para os payloads da API.
 * @source openapi.json
 */

/**
 * @description Payload para o endpoint POST /auth/login
 */
export interface LoginRequestDto {
  email: string;
  password?: string;
}

/**
 * @description Resposta de sucesso do endpoint POST /auth/login
 */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * @description Payload para o endpoint POST /account/user (Registro)
 */
export interface RegisterUserRequestDto {
  firstName: string;
  lastName: string;
  password?: string;
  phone: string;
  email: string;
  cpf: string;
  // O endereço foi removido daqui pois não está no openapi.json para o registro.
  // Se for necessário, o contrato DEVE ser atualizado primeiro.
}

/**
 * @description Resposta de sucesso do endpoint POST /account/user (Registro)
 * @source openapi.json
 */
export interface RegisterUserResponseDto {
  accessToken: string;
  refreshToken: string;
}
