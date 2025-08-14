'use client';

import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hourglass } from "lucide-react";

export function ClubRequestView({ initialRequests }: { initialRequests: ClubRequestStatusDto[] }) {
  const pendingRequest = initialRequests?.find(req => req.status === 'PENDING');

  if (pendingRequest) {
    return (
        <Alert>
          <Hourglass className="h-4 w-4" />
          <AlertTitle>Solicitação em Análise</AlertTitle>
          <AlertDescription>
            A solicitação para criar o clube &quot;{pendingRequest.clubName}&quot; está sendo analisada pela administração.
          </AlertDescription>
        </Alert>
    );
  }

  return <div>Nenhuma solicitação pendente encontrada.</div>;
}