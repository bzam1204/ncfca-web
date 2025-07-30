import {useQuery} from "@tanstack/react-query";

import {Dependant} from "@/domain/entities/dependant.entity";

import {GetDependantsAction} from "@/infraestructure/actions/get-dependants.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useGetDependants() {
  return useQuery<Dependant[]>({
    queryKey : QueryKeys.dependants.all,
    queryFn : () => GetDependantsAction(),
  });
}
