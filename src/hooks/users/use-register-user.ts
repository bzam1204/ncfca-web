'use client';

import { useMutation } from '@tanstack/react-query';
import { registerUserAction } from '@/infrastructure/actions/register-user.action';

interface RegisterUserParams {
  // Placeholder - definir quando necessário
  userData: any;
}

export function useRegisterUserMutation() {
  return useMutation({
    mutationFn: ({ userData }: RegisterUserParams) => registerUserAction(userData),
  });
}
