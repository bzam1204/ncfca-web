'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getAffiliationsAction } from '@/infrastructure/actions/admin/get-affiliations.action';

export function useAdminAffiliations() {
  return useQuery({
    queryKey: QueryKeys.admin.affiliations(),
    queryFn: () => getAffiliationsAction(),
  });
}
