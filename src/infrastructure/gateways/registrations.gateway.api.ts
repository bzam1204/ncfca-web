import { revalidateTag } from 'next/cache';

import { RegistrationsGateway } from '@/application/gateways/registrations/registrations.gateway';

import {
  RequestIndividualRegistrationInputDto,
  RequestIndividualRegistrationOutputDto,
  GetMyPendingRegistrationsListItemView,
  RequestDuoRegistrationOutputDto,
  SearchMyRegistrationsFilter,
  RequestDuoRegistrationDto,
  SearchMyRegistrationView,
  CancelRegistrationDto,
} from '@/contracts/api/registration.dto';

import { NextKeys } from '../cache/next-keys';

export class RegistrationsGatewayApi implements RegistrationsGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async searchMyRegistrations(filter?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView> {
    const params = new URLSearchParams();
    if (filter?.tournamentName) params.append('filter[tournamentName]', filter.tournamentName);
    if (filter?.status) params.append('filter[status]', filter.status);
    if (filter?.order) params.append('filter[order]', filter.order);
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));
    const url = `${this.baseUrl}/my-registrations${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      next: {
        revalidate: 300,
        tags: [NextKeys.registrations.mine],
      },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar minhas inscrições');
    }
    return res.json();
  }

  async findMyPendingRegistrations(): Promise<GetMyPendingRegistrationsListItemView[]> {
    const res = await fetch(`${this.baseUrl}/my-registrations/pending`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      next: {
        revalidate: 300,
        tags: [NextKeys.registrations.pending],
      },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao buscar inscrições pendentes');
    }
    return res.json();
  }

  async registerIndividualCompetitor(input: RequestIndividualRegistrationInputDto): Promise<RequestIndividualRegistrationOutputDto> {
    const res = await fetch(`${this.baseUrl}/registrations/request-individual`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao registrar competidor individual');
    }
    revalidateTag(NextKeys.featuredTournaments.list);
    revalidateTag(NextKeys.tournaments.search({ filter: {}, pagination: {} }));
    revalidateTag(NextKeys.tournaments.details(input.tournamentId));
    revalidateTag(NextKeys.registrations.mine);
    revalidateTag(NextKeys.registrations.pending);
    return res.json();
  }

  async requestDuoCompetitorRegistration(input: RequestDuoRegistrationDto): Promise<RequestDuoRegistrationOutputDto> {
    const res = await fetch(`${this.baseUrl}/registrations/request-duo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao solicitar registro de dupla');
    }
    revalidateTag(NextKeys.featuredTournaments.list);
    revalidateTag(NextKeys.tournaments.search({ filter: {}, pagination: {} }));
    revalidateTag(NextKeys.tournaments.details(input.tournamentId));
    revalidateTag(NextKeys.registrations.mine);
    revalidateTag(NextKeys.registrations.pending);
    return res.json();
  }

  async acceptDuoCompetitorRegistration(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/registrations/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao aceitar registro de dupla');
    }
    revalidateTag(NextKeys.registrations.mine);
    revalidateTag(NextKeys.registrations.pending);
  }

  async rejectDuoCompetitorRegistration(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/registrations/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao rejeitar registro de dupla');
    }
    revalidateTag(NextKeys.registrations.pending);
    revalidateTag(NextKeys.registrations.mine);
  }

  async cancelCompetitorRegistration(input: CancelRegistrationDto): Promise<void> {
    const res = await fetch(`${this.baseUrl}/registrations/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || 'Falha ao cancelar inscrição');
    }
    revalidateTag(NextKeys.registrations.mine);
  }
}
