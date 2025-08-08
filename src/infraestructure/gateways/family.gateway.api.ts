import {Club} from "@/domain/entities/entities";

import {ClubGateway} from "@/application/gateways/club.gateway";

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";
import {FamilyGateway} from "@/application/gateways/family.gateway";
import {Dependant} from "@/domain/entities/dependant.entity";
import {NextKeys} from "@/infraestructure/cache/next-keys";

export class FamilyGatewayApi implements FamilyGateway {
  constructor(
      private readonly baseUrl: string,
      private readonly accessToken: string
  ) {
  }

  async getMyDependants(): Promise<Dependant[]> {
    const res = await fetch(`${this.baseUrl}/dependants`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`},
      next: {tags: [NextKeys.family.myDependants]}
    });
    if (!res.ok) throw new Error('Falha ao buscar dependentes.');
    return res.json();
  }

}
