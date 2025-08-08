import {Club, Family, User} from "@/domain/entities/entities";
import {EnrollmentRequest} from "@/domain/entities/enrollment-request.entity";

import {AdminGateway} from "@/application/gateways/admin.gateway";

import {NextKeys} from "@/infraestructure/cache/next-keys";

export class AdminGatewayApi implements AdminGateway {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly revalidateInSeconds: number = 600; // 10 minutos

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private async fetchData<T>(endpoint: string, tag: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/admin/${endpoint}`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next : {
        revalidate : this.revalidateInSeconds,
        tags : [tag],
      },
    });
    if (!res.ok) {
      throw new Error(`Falha ao buscar dados de /admin/${endpoint}`);
    }
    return res.json();
  }

  getAffiliations(): Promise<Family[]> {
    return this.fetchData<Family[]>('affiliations', NextKeys.admin.affiliations);
  }

  getClubs(): Promise<Club[]> {
    return this.fetchData<Club[]>('clubs', NextKeys.admin.clubs);
  }

  getEnrollments(): Promise<EnrollmentRequest[]> {
    return this.fetchData<EnrollmentRequest[]>('enrollments', NextKeys.admin.enrollments);
  }

  getUsers(): Promise<User[]> {
    return this.fetchData<User[]>('users', NextKeys.admin.users);
  }
}
