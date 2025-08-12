'use client';

import { useQuery } from '@tanstack/react-query';
import { searchUsersAction } from '@/infraestructure/actions/admin/search-users.action';
import { SearchUsersQuery } from '@/contracts/api/user.dto';
import { QueryKeys } from '@/infraestructure/cache/query-keys';

export function useSearchUsers(query: SearchUsersQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: QueryKeys.admin.searchUsers(query),
    queryFn: () => searchUsersAction(query),
    enabled: enabled && Boolean(query.name?.trim()),
    staleTime: 1000 * 30,
  });
}