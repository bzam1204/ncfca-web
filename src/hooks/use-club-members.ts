'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { getClubMembersAction } from '@/infraestructure/actions/get-club-members.action';

export function useClubMembersQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.members(clubId),
    queryFn: () => getClubMembersAction(clubId),
    enabled: !!clubId,
  });
}