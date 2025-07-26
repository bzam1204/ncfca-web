import {useMutation} from '@tanstack/react-query';
import {RegisterUserRequestDto} from "@/contracts/api/auth.dto";

async function registerUser(data: RegisterUserRequestDto) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BACKEND_URL}/account/user`, {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify(data),
  });
  if (!res.ok) {
    const errorPayload = await res.json();
    const errorMessage = errorPayload.message || 'Ocorreu um erro desconhecido. Contate o suporte.';
    throw new Error(errorMessage);
  }
  return res.json();
}

export const useRegisterUser = () => {
  return useMutation({
    mutationFn : registerUser,
  });
};
