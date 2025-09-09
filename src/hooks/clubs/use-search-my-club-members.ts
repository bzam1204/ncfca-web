'use client';

import {useQuery} from '@tanstack/react-query';

import {SearchMyClubMembersQuery, SearchMyClubMembersView} from '@/contracts/api/club-member.dto';

import {searchMyClubMembersAction} from '@/infrastructure/actions/search-my-club-members.action';
import {QueryKeys} from '@/infrastructure/cache/query-keys';

export function useSearchMyClubMembers(query?: SearchMyClubMembersQuery) {
  return useQuery<SearchMyClubMembersView>({
    queryKey : QueryKeys.myClub.members(query),
    queryFn : () => searchMyClubMembersAction(query),
  });
}
