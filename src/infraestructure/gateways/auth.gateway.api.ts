import { AuthGateway } from "@/application/gateways/auth.gateway";
import { RegisterUserRequestDto, RegisterUserResponseDto } from "@/contracts/api/auth.dto";

export class AuthGatewayApi implements AuthGateway {
  constructor(private readonly baseUrl: string) {}

  async register(userData: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    const res = await fetch(`${this.baseUrl}/account/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao registrar usuário');
    }
    
    return res.json();
  }
}