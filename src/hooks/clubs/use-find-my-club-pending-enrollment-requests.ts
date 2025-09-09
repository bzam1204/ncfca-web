'use client';

import { useQuery } from '@tanstack/react-query';

import { findMyClubPendingEnrollmentRequestsAction } from '@/infrastructure/actions/find-my-club-pending-enrollment-requests.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useFindMyClubPendingEnrollmentRequests() {
  return useQuery({
    queryKey: QueryKeys.myClub.pendingEnrollmentsRequests(),
    queryFn: findMyClubPendingEnrollmentRequestsAction,
  });
}
