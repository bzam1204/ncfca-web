'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { GetDependantsAction } from '@/infraestructure/actions/get-dependants.action';
import { addDependantAction } from '@/infraestructure/actions/add-dependant.action';
import { updateDependantAction } from '@/infraestructure/actions/update-dependant.action';
import { deleteDependantAction } from '@/infraestructure/actions/delete-dependant.action';
import { AddDependantRequestDto, UpdateDependantRequestDto } from '@/contracts/api/dependant.dto';
import { DependantMapper } from '@/infraestructure/mappers/dependant.mapper';

//todo: move to a its own file
export function useGetDependants() {
  return useQuery({
    queryKey: QueryKeys.dependants.all,
    queryFn: async () => {
      const dtos = await GetDependantsAction();
      return dtos.map(DependantMapper.mapDtoToEntity);
    },
  });
}

//todo: move to a its own file
export function useAddDependantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddDependantRequestDto) => addDependantAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.dependants.all });
    },
  });
}

//todo: move to a its own file
export function useUpdateDependantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dependantId, data }: { dependantId: string; data: UpdateDependantRequestDto }) => 
      updateDependantAction(dependantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.dependants.all });
    },
  });
}

//todo: move to a its own file
export function useDeleteDependantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dependantId: string) => deleteDependantAction(dependantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.dependants.all });
    },
  });
}