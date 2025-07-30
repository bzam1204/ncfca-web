import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTrainingAction} from "@/infraestructure/actions/delete-training.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn : (id) => deleteTrainingAction(id),
    onSuccess : () => queryClient.invalidateQueries({queryKey : QueryKeys.trainings.all}),
  });
}
