import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTrainingAction } from '@/infrastructure/actions/delete-training.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteTrainingAction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QueryKeys.trainings.all }),
  });
}
