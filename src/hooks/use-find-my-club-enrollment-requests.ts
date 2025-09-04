'use client';

import { useQuery } from '@tanstack/react-query';

import { findMyClubEnrollmentRequestsAction } from '@/infrastructure/actions/find-my-club-enrollment-requests.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useFindMyClubEnrollmentRequests() {
  return useQuery({
    queryKey: QueryKeys.myClub.enrollmentRequests(),
    queryFn: () => findMyClubEnrollmentRequestsAction(),
  });
}

