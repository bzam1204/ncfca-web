import {useQuery} from "@tanstack/react-query";

import {Training} from "@/domain/entities/training.entity";

import {getTrainingsAction} from "@/infraestructure/actions/get-trainings.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useGetTrainings() {
  return useQuery<Training[]>({
    queryKey : QueryKeys.trainings.all,
    queryFn : () => getTrainingsAction().then(res => res.map(t => new Training(t))),
  });
}
