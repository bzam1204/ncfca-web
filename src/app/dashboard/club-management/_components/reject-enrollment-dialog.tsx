// src/app/dashboard/club-management/_components/reject-enrollment-dialog.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

const rejectionSchema = z.object({
  reason: z.string().min(10, { message: 'O motivo deve ter no mínimo 10 caracteres.' }),
});

type RejectionInput = z.infer<typeof rejectionSchema>;

interface RejectEnrollmentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (reason: string) => void;
  isPending: boolean;
}

export function RejectEnrollmentDialog({ isOpen, onOpenChange, onSubmit, isPending }: RejectEnrollmentDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RejectionInput>({
    resolver: zodResolver(rejectionSchema),
  });

  const handleFormSubmit = (data: RejectionInput) => {
    onSubmit(data.reason);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  }

  return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Matrícula</DialogTitle>
            <DialogDescription>
              Por favor, forneça um motivo claro e conciso para a rejeição. Esta informação será visível para o responsável familiar.
            </DialogDescription>
          </DialogHeader>
          <form id="rejection-form" onSubmit={handleSubmit(handleFormSubmit)} className="py-4 space-y-2">
            <Label htmlFor="reason">Motivo da Rejeição</Label>
            <Textarea
                id="reason"
                placeholder="Ex: Infelizmente, não temos mais vagas disponíveis para esta faixa etária..."
                className="min-h-[100px]"
                {...register('reason')}
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
          </form>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancelar</Button>
            <Button type="submit" form="rejection-form" variant="destructive" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
