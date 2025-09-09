'use client';

import { useQuery } from '@tanstack/react-query';

import { SearchClubMembersQueryDto } from '@/contracts/api/admin.dto';

import { getClubMembersAction } from '@/infrastructure/actions/admin/get-club-members.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useAdminClubMembers(query: SearchClubMembersQueryDto) {
  return useQuery({
    queryKey: QueryKeys.admin.clubMembers(query.clubId, query.filter, query.pagination),
    queryFn: () => getClubMembersAction(query),
  });
}
