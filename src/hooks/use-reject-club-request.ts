'use client';

import { useMutation } from "@tanstack/react-query";
import { rejectClubRequestAction } from "@/infraestructure/actions/admin/reject-club-request.action";
import { useNotify } from "@/hooks/use-notify";
import { RejectRequestDto } from "@/contracts/api/club-request.dto";

export function useRejectClubRequest() {
  const notify = useNotify();
  return useMutation({
    mutationFn: (variables: { requestId: string; dto: RejectRequestDto }) =>
        rejectClubRequestAction(variables.requestId, variables.dto),
    onSuccess: () => {
      notify.success("Solicitação de clube rejeitada.");
    },
    onError: (error) => {
      notify.error(`Falha ao rejeitar: ${error.message}`);
    }
  });
}
