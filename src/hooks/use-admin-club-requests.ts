'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getClubEnrollmentsPendingAction } from '@/infrastructure/actions/admin/get-club-enrollments-pending.action';

export function useAdminClubRequests(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.admin.clubEnrollmentsPending(clubId),
    queryFn: () => getClubEnrollmentsPendingAction(clubId),
    enabled: !!clubId,
  });
}