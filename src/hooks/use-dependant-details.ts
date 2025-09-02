'use client';

import {useQuery} from '@tanstack/react-query';

import {Dependant} from "@/domain/entities/dependant.entity";

import {getDependantByIdAction} from '@/infrastructure/actions/get-dependant-by-id.action';
import {QueryKeys} from "@/infrastructure/cache/query-keys";

export function useDependantDetails(dependantId: string) {
  return useQuery({
    queryKey : QueryKeys.dependants.details(dependantId),
    queryFn : async () => {
      const dependantDto = await getDependantByIdAction(dependantId);
      const dependant = dependantDto ? new Dependant(dependantDto) : null;
      return dependant;
    },
  });
}
