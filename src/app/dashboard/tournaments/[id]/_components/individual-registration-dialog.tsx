'use client';

import { PropsWithChildren, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

import { useGetDependants } from '@/hooks/use-get-dependants';
import { useRequestIndividualRegistration } from '@/hooks/use-request-individual-registration';

export function IndividualRegistrationDialog({ tournament, disabled, children }: PropsWithChildren<{ tournament: TournamentDetailsView; disabled?: boolean }>) {
  const [open, setOpen] = useState(false);
  const [selectedDependantId, setSelectedDependantId] = useState<string>('');

  const dependantsQuery = useGetDependants();
  const dependants = dependantsQuery.data ?? [];
  const { mutate, isPending } = useRequestIndividualRegistration();

  const handleClose = () => {
    setOpen(false);
    setSelectedDependantId('');
  };

  const handleSubmit = () => {
    if (!selectedDependantId || !tournament?.id) return;
    mutate(
      { competitorId: selectedDependantId, tournamentId: tournament.id },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrição Individual</DialogTitle>
          <DialogDescription>
            Selecione um dependente para inscrever no torneio &quot;{tournament.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {dependants.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="dependant-select">Selecione o Dependente</Label>
              <Select onValueChange={setSelectedDependantId} value={selectedDependantId}>
                <SelectTrigger id="dependant-select">
                  <SelectValue placeholder="Escolha um dependente..." />
                </SelectTrigger>
                <SelectContent>
                  {dependants.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.firstName} {d.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Nenhum Dependente Cadastrado</AlertTitle>
              <AlertDescription>Cadastre um dependente antes de realizar a inscrição.</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !selectedDependantId}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Inscrição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
