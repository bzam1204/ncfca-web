'use client';

import { useQuery } from '@tanstack/react-query';

import { SearchMyClubMembersQueryDto } from '@/contracts/api/club-member.dto';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

import { getClubMembersAction } from '@/infrastructure/actions/get-club-members.action';

export function useClubMembersQuery(query: SearchMyClubMembersQueryDto) {
  return useQuery({
    queryKey: QueryKeys.club.myClubMembers(query),
    queryFn: () => getClubMembersAction(query),
  });
}
