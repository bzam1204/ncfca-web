import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";
import {createTrainingAction} from "@/infraestructure/actions/create-training.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation<TrainingDto, Error, CreateTrainingDto>({
    mutationFn : (dto) => createTrainingAction(dto),
    onSuccess : () => queryClient.invalidateQueries({queryKey : QueryKeys.trainings.all}),
  })
      ;
}
