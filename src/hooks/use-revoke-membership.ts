'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { revokeMembershipAction } from '@/infraestructure/actions/revoke-membership.action';

interface RevokeMembershipParams {
  clubId: string;
  memberId: string;
}

export function useRevokeMembershipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, memberId }: RevokeMembershipParams) => 
      revokeMembershipAction(clubId, memberId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.members(clubId) });
    },
  });
}