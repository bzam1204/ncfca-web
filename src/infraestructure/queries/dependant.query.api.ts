import {Dependant} from "@/domain/entities/dependant.entity";

import {DependantQuery} from "@/application/use-cases/queries/dependant.query";

export class DependantQueryApi implements DependantQuery {

  constructor(private readonly baseUrl: string, private readonly accessToken: string) {
  }

  async getAll(): Promise<Dependant[]> {
    if (!this.accessToken) throw new Error('Access token is not set.');
    const res = await fetch(`${this.baseUrl}/dependants`, {
      headers : {'Authorization' : `Bearer ${this.accessToken}`}
    });
    if (!res.ok) throw new Error('Falha ao buscar dependentes.');
    return res.json();
  }

}
