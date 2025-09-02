'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getPendingEnrollmentsAction } from '@/infrastructure/actions/get-pending-enrollments.action';

export function usePendingEnrollmentsQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.pendingEnrollments(clubId),
    queryFn: () => getPendingEnrollmentsAction(clubId),
    enabled: !!clubId,
  });
}
