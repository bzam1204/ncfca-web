'use client';

import { PropsWithChildren, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

export function DuoRegistrationDialog({ tournament, disabled, children }: PropsWithChildren<{ tournament: TournamentDetailsView; disabled?: boolean }>) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrição em Dupla</DialogTitle>
          <DialogDescription>
            Procure o parceiro pelo e-mail e confirme a inscrição para o torneio "{tournament.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="partnerEmail">E-mail do Parceiro</Label>
            <Input id="partnerEmail" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Alert>
            <AlertTitle>Pré-implementação</AlertTitle>
            <AlertDescription>
              A busca por parceiro e submissão serão implementadas na tarefa 9.0. Este diálogo é um placeholder funcional.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}

