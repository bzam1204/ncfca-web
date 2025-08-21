'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyFamilyAction } from '@/infraestructure/actions/get-my-family.action';

export function useMyFamily() {
  return useQuery({
    queryKey: ['my-family'],
    queryFn: () => getMyFamilyAction(),
  });
}