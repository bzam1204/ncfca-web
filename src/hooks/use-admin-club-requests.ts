'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { getClubEnrollmentsPendingAction } from '@/infraestructure/actions/admin/get-club-enrollments-pending.action';

export function useAdminClubRequests(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.admin.clubEnrollmentsPending(clubId),
    queryFn: () => getClubEnrollmentsPendingAction(clubId),
    enabled: !!clubId,
  });
}