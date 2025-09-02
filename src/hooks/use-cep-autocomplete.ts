import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { CepService } from '@/domain/services/cep.service';

import { RegisterInput } from '@/infrastructure/validators/register.schema';

export function useCepAutocomplete(setValue: UseFormSetValue<RegisterInput>, cepService: CepService) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCepChange(cep: string) {
    const sanitizedCep = cep.replace(/\D/g, '');
    if (sanitizedCep.length !== 8) {
      setError(null);
      return void 0;
    }
    setIsLoading(true);
    setError(null);
    try {
      const cepAddress = await cepService.fetchAddress(sanitizedCep);
      if (!cepAddress) throw new Error('Erro ao buscar endereço do CEP');
      setValue('address.district', cepAddress.district);
      setValue('address.street', cepAddress.street);
      setValue('address.state', cepAddress.state);
      setValue('address.city', cepAddress.city);
    } catch {
      setError('Erro ao buscar endereço do CEP');
    } finally {
      setIsLoading(false);
    }
    return void 0;
  }
  return { handleCepChange, isLoadingCep: isLoading, errorCep: error };
}
