'use client';

import { useQuery } from '@tanstack/react-query';
import { searchUsersAction } from '@/infrastructure/actions/admin/search-users.action';
import { SearchUsersQuery } from '@/contracts/api/user.dto';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useSearchUsers(query: SearchUsersQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: QueryKeys.admin.searchUsers(query),
    queryFn: () => searchUsersAction(query),
    enabled: enabled,
    staleTime: 1000 * 30,
  });
}
