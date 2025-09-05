'use client';

import { PropsWithChildren, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

export function IndividualRegistrationDialog({ tournament, disabled, children }: PropsWithChildren<{ tournament: TournamentDetailsView; disabled?: boolean }>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrição Individual</DialogTitle>
          <DialogDescription>
            Selecione um dependente para inscrever no torneio "{tournament.name}".
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertTitle>Disponível no próximo passo</AlertTitle>
          <AlertDescription>
            O fluxo completo de inscrição será implementado na tarefa 9.0. Esta é uma prévia do diálogo.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}

