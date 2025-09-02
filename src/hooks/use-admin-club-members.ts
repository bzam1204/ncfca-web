'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { getClubMembersAction } from '@/infrastructure/actions/admin/get-club-members.action';
import { SearchClubMembersQueryDto } from '@/contracts/api/admin.dto';

export function useAdminClubMembers(query: SearchClubMembersQueryDto) {
  return useQuery({
    queryKey: QueryKeys.admin.clubMembers(query.clubId, query.filter, query.pagination),
    queryFn: () => getClubMembersAction(query),
  });
}

