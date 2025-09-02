'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getClubMembersAction } from '@/infrastructure/actions/admin/get-club-members.action';

export function useAdminClubMembers(clubId: string) {
  return useQuery({
    queryKey: QueryKeys.admin.clubMembers(clubId),
    queryFn: () => getClubMembersAction(clubId),
    enabled: !!clubId,
  });
}