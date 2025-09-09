import { useQuery } from '@tanstack/react-query';

import { GetMyPendingRegistrationsListItemView } from '@/contracts/api/registration.dto';

import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getMyPendingRegistrationsAction } from '@/infrastructure/actions/registrations/get-my-pending-registrations.action';

export function useMyPendingRegistrations() {
  const query = useQuery<GetMyPendingRegistrationsListItemView[]>({
    queryKey: QueryKeys.registrations.pending(),
    queryFn: () => getMyPendingRegistrationsAction(),
    staleTime: 1 * 60 * 1000,
  });
  return {
    pendingRegistrations: query.data ?? [],
    ...query,
  };
}