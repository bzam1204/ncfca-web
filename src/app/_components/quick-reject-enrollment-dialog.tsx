// src/app/dashboard/club-management/_components/reject-enrollments-dialog.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const rejectionSchema = z.object({
  reason: z.string().min(10, 'O motivo deve ter pelo menos 10 caracteres.'),
});
type RejectionInput = z.infer<typeof rejectionSchema>;

interface RejectEnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RejectionInput) => void;
  isPending: boolean;
}

export function QuickRejectEnrollmentDialog({ isOpen, onClose, onSubmit, isPending }: RejectEnrollmentDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectionInput>({
    resolver: zodResolver(rejectionSchema),
  });

  const handleClose = () => {
    reset(); // Limpa o formulário ao fechar
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar Matrícula</DialogTitle>
          <DialogDescription>
            Por favor, forneça um motivo claro para a rejeição. Esta informação será visível para o responsável familiar.
          </DialogDescription>
        </DialogHeader>
        <form id="rejection-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Label htmlFor="reason">Motivo da Rejeição</Label>
            <Textarea id="reason" {...register('reason')} className="mt-2" />
            {errors.reason && <p className="text-sm text-red-500 mt-2">{errors.reason.message}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="rejection-form" variant="destructive" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
