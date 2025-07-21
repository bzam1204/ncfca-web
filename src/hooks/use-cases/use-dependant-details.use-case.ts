// src/hooks/use-cases/use-dependant-details.use-case.ts
'use client';

import {useQuery} from '@tanstack/react-query';
import {DependantDetailsDto} from '@/contracts/api/dependant.dto';

// ESTA FUNÇÃO DEPENDE DE UM NOVO ENDPOINT NO BACKEND
const getDependantDetails = async (dependantId: string, accessToken: string): Promise<DependantDetailsDto> => {
  // ROTA HIPOTÉTICA QUE O BACKEND DEVE IMPLEMENTAR
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dependants/${dependantId}`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) {
    throw new Error('Falha ao buscar detalhes do dependente.');
  }
  return res.json();
};

export const useDependantDetailsQuery = (dependantId: string | null, accessToken: string) => {
  return useQuery({
    queryKey : ['dependant-details', dependantId],
    queryFn : () => getDependantDetails(dependantId!, accessToken),
    enabled : !!dependantId && !!accessToken,
    retry : 1, // Reduz as tentativas, já que o endpoint pode não existir
  });
};
