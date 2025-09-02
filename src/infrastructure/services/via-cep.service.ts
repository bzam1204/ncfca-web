import { CepAddress, CepService } from '@/domain/services/cep.service';

import { ViaCepResponse } from '@/types/via-cep.types';

export class ViaCepService implements CepService {
  public async fetchAddress(cep: string): Promise<CepAddress | null> {
    const formattedCep = cep.replace(/\D/g, '');
    if (formattedCep.length !== 8) return null;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      if (!response.ok) return null;
      const data: ViaCepResponse = await response.json();
      if (data.erro) return null;
      return {
        district: data.bairro,
        zipCode: data.cep,
        street: data.logradouro,
        state: data.uf,
        city: data.localidade,
      };
    } catch {
      return null;
    }
  }
}

export const viaCepService = new ViaCepService();
