'use client';

import { useQuery } from '@tanstack/react-query';
import { getDependantByIdAction } from '@/infraestructure/actions/get-dependant-by-id.action';

export function useDependantDetails(dependantId: string | null) {
  return useQuery({
    queryKey: ['dependant', dependantId],
    queryFn: () => getDependantByIdAction(dependantId!),
    enabled: !!dependantId,
  });
}