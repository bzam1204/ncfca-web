'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { getEnrollmentHistoryAction } from '@/infraestructure/actions/get-enrollment-history.action';

export function useEnrollmentHistoryQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.enrollmentHistory(clubId),
    queryFn: () => getEnrollmentHistoryAction(clubId),
    enabled: !!clubId,
  });
}