import {useQuery} from "@tanstack/react-query";

import {Training} from "@/domain/entities/training.entity";

import {QueryKeys} from "@/infraestructure/cache/query-keys";
import {getTrainingsAction} from "@/infraestructure/actions/get-trainings.action";

export function useGetTrainings() {
  const query = useQuery<Training[]>({
    queryKey : QueryKeys.trainings.all,
    queryFn : () => getTrainingsAction().then(res => res.map(t => new Training(t))),
  });
  return {
    trainings : query.data ?? [],
    ...query,
  }
}
