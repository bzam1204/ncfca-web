'use client';

import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hourglass } from "lucide-react";
import { CreateClubForm } from "./create-club-form";
import {useMyClubRequests} from "@/hooks/use-my-club-requests";

export function ClubRequestView({ initialRequests }: { initialRequests: ClubRequestStatusDto[] }) {
  const { data: requests, isLoading } = useMyClubRequests(initialRequests);
  const pendingRequest = requests?.find(req => req.status === 'PENDING');

  if (isLoading) return <div>Carregando...</div>; // Ou um Skeleton

  if (pendingRequest) {
    return (
        <Alert>
          <Hourglass className="h-4 w-4" />
          <AlertTitle>Solicitação em Análise</AlertTitle>
          <AlertDescription>
            Sua solicitação para criar o clube "{pendingRequest.clubName}" foi recebida e está sendo analisada pela administração.
          </AlertDescription>
        </Alert>
    );
  }

  return <CreateClubForm />;
}