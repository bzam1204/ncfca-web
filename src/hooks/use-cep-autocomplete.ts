// src/hooks/useCepAutocomplete.ts

import {useState} from 'react';
import {UseFormSetValue} from 'react-hook-form';
import {RegisterInput} from '@/lib/validators/register.schema';
import {fetchAddressByCep} from "@/lib/providers/services/cep.service";

export const useCepAutocomplete = (
    setValue: UseFormSetValue<RegisterInput>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCepChange = async (cep: string) => {
    // Apenas busca quando o CEP tem 8 dígitos numéricos
    const numericCep = cep.replace(/\D/g, '');
    if (numericCep.length !== 8) {
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const address = await fetchAddressByCep(numericCep);

      // Atualiza os campos do formulário com os dados recebidos
      setValue('address.street', address.logradouro);
      setValue('address.district', address.bairro);
      setValue('address.city', address.localidade);
      setValue('address.state', address.uf);

    } catch (err: any) {
      setError(err.message || 'Erro ao buscar CEP.');
      // Limpa os campos em caso de erro para evitar dados inconsistentes
      setValue('address.street', '');
      setValue('address.district', '');
      setValue('address.city', '');
      setValue('address.state', '');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleCepChange,
  };
};