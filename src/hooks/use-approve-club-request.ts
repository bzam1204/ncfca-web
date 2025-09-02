'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveClubRequestAction } from "@/infrastructure/actions/admin/approve-club-request.action";
import { useNotify } from "@/hooks/use-notify";
import { QueryKeys } from "@/infrastructure/cache/query-keys";

export function useApproveClubRequest() {
  const notify = useNotify();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (requestId: string) => approveClubRequestAction(requestId),
    onSuccess: () => {
      // Invalidate club requests queries to refresh the data
      queryClient.invalidateQueries({ queryKey: QueryKeys.clubRequests.all });
      notify.success("Solicitação de clube aprovada com sucesso.");
    },
    onError: (error) => {
      notify.error(`Falha ao aprovar: ${error.message}`);
    }
  });
}