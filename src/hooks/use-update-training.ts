import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";
import {updateTrainingAction} from "@/infraestructure/actions/update-training.action";
import {QueryKeys} from "@/infraestructure/cache/query-keys";

export function useUpdateTraining() {
  const queryClient = useQueryClient();
  return useMutation<TrainingDto, Error, {id: string, dto: UpdateTrainingDto}>({
    mutationFn : ({id, dto}) => updateTrainingAction(id, dto),
    onSuccess : () => queryClient.invalidateQueries({queryKey : QueryKeys.trainings.all}),
  });
}
