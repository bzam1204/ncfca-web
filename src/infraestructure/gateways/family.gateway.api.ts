import {FamilyGateway} from "@/application/gateways/family.gateway";
import {Dependant} from "@/domain/entities/dependant.entity";
import {Family} from "@/domain/entities/entities";
import {NextKeys} from "@/infraestructure/cache/next-keys";
import {AddDependantRequestDto, UpdateDependantRequestDto} from "@/contracts/api/dependant.dto";

export class FamilyGatewayApi implements FamilyGateway {
  constructor(
      private readonly baseUrl: string,
      private readonly accessToken: string
  ) {
  }

  async getMyFamily(): Promise<Family> {
    const res = await fetch(`${this.baseUrl}/family/me`, {
      headers: {'Authorization': `Bearer ${this.accessToken}`},
      next: {tags: [NextKeys.family.me]}
    });
    if (!res.ok) throw new Error('Falha ao buscar informações da família.');
    return res.json();
  }

  async getMyDependants(): Promise<Dependant[]> {
    const res = await fetch(`${this.baseUrl}/dependants`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next: {tags: [NextKeys.family.myDependants]}
    });
    if (!res.ok) throw new Error('Falha ao buscar dependentes.');
    return res.json();
  }

  async getDependantById(dependantId: string): Promise<Dependant> {
    const res = await fetch(`${this.baseUrl}/dependants/${dependantId}`, {
      headers: {'Authorization': `Bearer ${this.accessToken}`},
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Falha ao buscar detalhes do dependente.');
    const data = await res.json();
    return new Dependant(data);
  }

  async addDependant(data: AddDependantRequestDto): Promise<Dependant> {
    const res = await fetch(`${this.baseUrl}/dependants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao adicionar dependente');
    }
    const result = await res.json();
    return new Dependant(result);
  }

  async updateDependant(dependantId: string, data: UpdateDependantRequestDto): Promise<Dependant> {
    const res = await fetch(`${this.baseUrl}/dependants/${dependantId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao atualizar dependente');
    }
    const result = await res.json();
    return new Dependant(result);
  }

  async deleteDependant(dependantId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/dependants/${dependantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao remover dependente');
    }
  }

  async checkout(params: { paymentMethod: string; paymentToken: string }): Promise<void> {
    const res = await fetch(`${this.baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao processar pagamento');
    }
  }

}
