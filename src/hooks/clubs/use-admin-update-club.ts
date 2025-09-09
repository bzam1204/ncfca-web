import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUpdateClubAction } from '@/infrastructure/actions/admin-update-club.action';
import { UpdateClubByAdminDto } from '@/contracts/api/admin.dto';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useAdminUpdateClub(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, payload }: { clubId: string; payload: UpdateClubByAdminDto }) => adminUpdateClubAction(clubId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubs() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.clubs.search.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubById(clubId) });
    },
  });
}
