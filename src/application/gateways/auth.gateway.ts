import { RegisterUserRequestDto, RegisterUserResponseDto } from '@/contracts/api/auth.dto';

export interface AuthGateway {
  /**
   * Registra um novo usuário no sistema
   * OpenAPI: POST /account/user
   */
  register(userData: RegisterUserRequestDto): Promise<RegisterUserResponseDto>;
}
