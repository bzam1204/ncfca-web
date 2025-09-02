'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyClubAction } from '@/infrastructure/actions/update-my-club.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useUpdateMyClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyClubAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.clubs.all });
    },
  });
}
