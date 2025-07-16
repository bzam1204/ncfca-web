// src/hooks/use-cases/useRegisterUser.ts
import { useMutation } from '@tanstack/react-query';
import { RegisterInput } from '@/lib/validators/register.schema';

// A função que efetivamente faz a chamada à API
const registerUser = async (data: RegisterInput) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BACKEND_URL}/account/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    // Tenta extrair a mensagem de erro da API, senão lança um erro genérico
    const errorData = await res.json();
    throw new Error( 'Falha ao registrar. Tente novamente.');
  }

  return res.json();
};

// O hook que os componentes da UI irão usar
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};