'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectClubRequestAction } from "@/infrastructure/actions/admin/reject-club-request.action";
import { useNotify } from "@/hooks/use-notify";
import { RejectRequestDto } from "@/contracts/api/club-request.dto";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useRejectClubRequest() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (variables: { requestId: string; dto: RejectRequestDto }) =>
        rejectClubRequestAction(variables.requestId, variables.dto),
    onSuccess: () => {
      // Invalidate club requests queries to refresh the data
      queryClient.invalidateQueries({ queryKey: QueryKeys.clubRequests.all });
      notify.success("Solicitação de clube rejeitada.");
    },
    onError: (error) => {
      notify.error(`Falha ao rejeitar: ${error.message}`);
    }
  });
}
