'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { getPendingEnrollmentsAction } from '@/infraestructure/actions/get-pending-enrollments.action';

export function usePendingEnrollmentsQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.pendingEnrollments(clubId),
    queryFn: () => getPendingEnrollmentsAction(clubId),
    enabled: !!clubId,
  });
}