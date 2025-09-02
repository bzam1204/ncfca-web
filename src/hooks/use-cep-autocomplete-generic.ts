import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { CepService } from '@/domain/services/cep.service';

export function useCepAutocompleteGeneric<T extends Record<string, any>>(
  setValue: UseFormSetValue<T>,
  cepService: CepService,
  addressPrefix: string = 'address',
) {
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

      setValue(`${addressPrefix}.district` as any, cepAddress.district as any);
      setValue(`${addressPrefix}.street` as any, cepAddress.street as any);
      setValue(`${addressPrefix}.state` as any, cepAddress.state as any);
      setValue(`${addressPrefix}.city` as any, cepAddress.city as any);
    } catch {
      setError('Erro ao buscar endereço do CEP');
    } finally {
      setIsLoading(false);
    }
    return void 0;
  }

  return { handleCepChange, isLoadingCep: isLoading, errorCep: error };
}
