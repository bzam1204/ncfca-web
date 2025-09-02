'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { TrainingForm } from '@/app/(admin)/admin/dashboard/trainings/_components/training-form';

export function CreateTrainingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Treinamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Treinamento</DialogTitle>
        </DialogHeader>
        <TrainingForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
