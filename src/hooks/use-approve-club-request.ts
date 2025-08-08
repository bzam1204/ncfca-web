'use client';

import { useMutation } from "@tanstack/react-query";
import { approveClubRequestAction } from "@/infraestructure/actions/admin/approve-club-request.action";
import { useNotify } from "@/hooks/use-notify";

export function useApproveClubRequest() {
  const notify = useNotify();
  return useMutation({
    mutationFn: (requestId: string) => approveClubRequestAction(requestId),
    onSuccess: () => {
      notify.success("Solicitação de clube aprovada com sucesso.");
    },
    onError: (error) => {
      notify.error(`Falha ao aprovar: ${error.message}`);
    }
  });
}