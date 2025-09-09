import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { SearchMyRegistrationsFilter, SearchMyRegistrationView } from '@/contracts/api/registration.dto';

import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getMyRegistrationsAction } from '@/infrastructure/actions/registrations/get-my-registrations.action';

export function useMyRegistrations(filter?: SearchMyRegistrationsFilter) {
  const queryResult = useQuery<SearchMyRegistrationView>({
    queryKey: QueryKeys.registrations.mine(filter),
    queryFn: () => getMyRegistrationsAction(filter),
    staleTime: 2 * 60 * 1000,
  });
  const registrations = useMemo(() => {
    return queryResult.data?.data ?? [];
  }, [queryResult.data?.data]);
  const meta = useMemo(() => {
    return queryResult.data?.meta;
  }, [queryResult.data?.meta]);
  return {
    registrations,
    meta,
    ...queryResult,
  };
}