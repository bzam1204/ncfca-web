'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { revokeMembershipAction } from '@/infrastructure/actions/revoke-membership.action';

interface RevokeMembershipParams {
  clubId: string;
  membershipId: string;
}

export function useRevokeMembershipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ membershipId }: RevokeMembershipParams) => 
      revokeMembershipAction(membershipId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.members(clubId) });
    },
  });
}