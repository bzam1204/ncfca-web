'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateClubRequestDto } from "@/contracts/api/club-management.dto";
import { createClubRequestAction } from "@/infraestructure/actions/create-club-request.action";
import { QueryKeys } from "@/infraestructure/cache/query-keys";
import { useNotify } from "@/hooks/use-notify";

export function useCreateClubRequest() {
  const queryClient = useQueryClient();
  const notify = useNotify();

  return useMutation({
    mutationFn: (dto: CreateClubRequestDto) => createClubRequestAction(dto),
    onSuccess: () => {
      notify.success("Solicitação enviada com sucesso!");
      // Invalida a query de solicitações para a UI ser atualizada
      return queryClient.invalidateQueries({ queryKey: QueryKeys.clubRequests.myRequests() });
    },
    onError: (error) => {
      notify.error(error.message);
    }
  });
}
