// src/app/dashboard/clubs/_components/enrollment-dialog.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRequestEnrollmentMutation } from '@/hooks/use-cases/use-enrollment.use-case';
import { useNotify } from '@/hooks/use-notify';
import { ClubDto } from '@/contracts/api/club.dto';
import { DependantResponseDto } from '@/contracts/api/dependant.dto';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';

interface EnrollmentDialogProps {
  club: ClubDto | null;
  dependants: DependantResponseDto[];
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollmentDialog({ club, dependants, isOpen, onClose }: EnrollmentDialogProps) {
  const [selectedDependantId, setSelectedDependantId] = useState<string>('');
  const notify = useNotify();
  const { data: session } = useSession();
  const { mutate: requestEnrollment, isPending } = useRequestEnrollmentMutation();

  const handleSubmit = () => {
    if (!selectedDependantId || !club?.id || !session?.accessToken) {
      notify.error("Informações incompletas para solicitar a matrícula.");
      return;
    }

    requestEnrollment({
      data: { dependantId: selectedDependantId, clubId: club.id },
      accessToken: session.accessToken
    }, {
      onSuccess: () => {
        notify.success(`Solicitação de matrícula para o clube "${club.name}" enviada com sucesso!`);
        handleClose();
      },
      onError: (error) => {
        notify.error(error.message);
      }
    });
  };

  const handleClose = () => {
    setSelectedDependantId('');
    onClose();
  }

  if (!club) return null;

  return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Matrícula para "{club.name}"</DialogTitle>
            <DialogDescription>Selecione um dependente para enviar a solicitação ao diretor do clube.</DialogDescription>
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
                      {dependants.map(d => (
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
                  <AlertDescription>Você precisa cadastrar um dependente antes de solicitar uma matrícula.</AlertDescription>
                </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleClose} disabled={isPending}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isPending || !selectedDependantId}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Confirmar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}