// src/hooks/use-cases/use-enrollment.use-case.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestEnrollmentDto } from '@/contracts/api/enrollment.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const requestEnrollment = async (payload: { data: RequestEnrollmentDto, accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Falha ao solicitar matrícula.');
  }
  // O endpoint retorna 201 Created sem corpo, então não há json() para retornar.
};

export const useRequestEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestEnrollment,
    onSuccess: () => {
      // Após uma solicitação bem-sucedida, invalida a lista de matrículas existentes
      // para que a nova solicitação apareça na tela de "Minhas Matrículas".
      return queryClient.invalidateQueries({ queryKey: ['my-enrollment-requests'] });
    },
  });
};
