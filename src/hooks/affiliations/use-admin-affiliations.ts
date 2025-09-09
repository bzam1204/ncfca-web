'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getAffiliationsAction } from '@/infrastructure/actions/admin/get-affiliations.action';
import { Dependant } from '@/domain/entities/dependant.entity';

export function useAdminAffiliations() {
  return useQuery({
    queryKey: QueryKeys.admin.affiliations(),
    queryFn: async () => {
      const affiliations = await getAffiliationsAction();
      for (const affiliation of affiliations) {
        affiliation.dependants = affiliation.dependants.map((dependant) => new Dependant(dependant));
      }
    },
  });
}
