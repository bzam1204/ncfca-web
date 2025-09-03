'use client';

import { useQuery } from '@tanstack/react-query';

import { getEnrollmentHistoryAction } from '@/infrastructure/actions/get-enrollment-history.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useEnrollmentHistoryQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.enrollmentHistory(clubId),
    queryFn: () => getEnrollmentHistoryAction(clubId),
    enabled: !!clubId,
  });
}
