'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { revokeMembershipAction } from '@/infrastructure/actions/revoke-membership.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useRevokeMembershipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ membershipId }: RevokeMembershipParams) => revokeMembershipAction(membershipId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.members(clubId) });
    },
  });
}

interface RevokeMembershipParams {
  membershipId: string;
  clubId: string;
}
