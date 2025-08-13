'use client';

import { useQuery } from '@tanstack/react-query';
import { User } from '@/domain/entities/entities';
import { getUserByIdAction } from '@/infraestructure/actions/admin/get-user-by-id.action';
import { QueryKeys } from '@/infraestructure/cache/query-keys';

export function useAdminUserById(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QueryKeys.admin.userById(userId),
    queryFn: () => getUserByIdAction(userId),
    enabled: enabled && Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}