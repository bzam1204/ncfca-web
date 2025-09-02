'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getClubMembersAction } from '@/infrastructure/actions/get-club-members.action';

export function useClubMembersQuery(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.club.members(clubId),
    queryFn: () => getClubMembersAction(clubId),
    enabled: !!clubId,
  });
}