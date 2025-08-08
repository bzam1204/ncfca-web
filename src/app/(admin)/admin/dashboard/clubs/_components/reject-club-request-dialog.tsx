'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { RejectRequestDto } from '@/contracts/api/club-request.dto';

const rejectionSchema = z.object({
  reason: z.string().min(10, { message: 'O motivo deve ter no mínimo 10 caracteres.' }),
});

interface RejectClubRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (dto: RejectRequestDto) => void;
  isPending: boolean;
}

export function RejectClubRequestDialog({ isOpen, onOpenChange, onSubmit, isPending }: RejectClubRequestDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RejectRequestDto>({
    resolver: zodResolver(rejectionSchema),
  });

  const handleFormSubmit = (data: RejectRequestDto) => {
    onSubmit(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(); // Limpa o formulário ao fechar
    }
    onOpenChange(open);
  }

  return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação de Clube</DialogTitle>
            <DialogDescription>
              Forneça um motivo claro para a rejeição. Esta informação poderá ser usada para notificar o solicitante.
            </DialogDescription>
          </DialogHeader>
          <form id="rejection-form" onSubmit={handleSubmit(handleFormSubmit)} className="py-4 space-y-2">
            <Label htmlFor="reason" className="sr-only">Motivo da Rejeição</Label>
            <Textarea
                id="reason"
                placeholder="Ex: Já existe um clube com nome similar nesta localidade..."
                className="min-h-[120px]"
                {...register('reason')}
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="rejection-form" variant="destructive" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
