import { MyEnrollmentRequestsDto, RequestEnrollmentDto } from '@/application/gateways/enrollment/enrollment.gateway.dto';
import { EnrollmentGateway } from '@/application/gateways/enrollment/enrollment.gateway';

export class EnrollmentGatewayApi implements EnrollmentGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async myRequests(): Promise<MyEnrollmentRequestsDto[]> {
    const res = await fetch(`${this.baseUrl}/enrollments/my-requests`, { headers: { Authorization: `Bearer ${this.accessToken}` } });
    if (!res.ok) throw new Error('Falha ao carregar suas solicitações.');
    return res.json();
  }

  async requestEnrollment(input: RequestEnrollmentDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.accessToken}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Falha ao solicitar matrícula.');
    }
    return;
  }
}
