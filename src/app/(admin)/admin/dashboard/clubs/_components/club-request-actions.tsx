'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RejectClubRequestDialog } from './reject-club-request-dialog';
import { RejectRequestDto } from '@/contracts/api/club-request.dto';
import { Loader2 } from 'lucide-react';
import { useApproveClubRequest } from '@/hooks/use-approve-club-request';
import { useRejectClubRequest } from '@/hooks/use-reject-club-request';

interface ClubRequestActionsProps {
  requestId: string;
}

export function ClubRequestActions({ requestId }: ClubRequestActionsProps) {
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { mutate: approve, isPending: isApproving } = useApproveClubRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectClubRequest();

  const isProcessing = isApproving || isRejecting;

  const handleRejectSubmit = (dto: RejectRequestDto) => {
    reject(
      { requestId, dto },
      {
        onSuccess: () => setRejectDialogOpen(false),
      },
    );
  };

  return (
    <div className="flex justify-end gap-2">
      <RejectClubRequestDialog isOpen={isRejectDialogOpen} onOpenChange={setRejectDialogOpen} onSubmit={handleRejectSubmit} isPending={isRejecting} />

      <Button size="sm" variant="destructive" onClick={() => setRejectDialogOpen(true)} disabled={isProcessing}>
        Rejeitar
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline" disabled={isProcessing}>
            {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aprovar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Criação de Clube?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação criará um novo clube na plataforma e o associará ao diretor solicitante. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => approve(requestId)}>Confirmar Aprovação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
