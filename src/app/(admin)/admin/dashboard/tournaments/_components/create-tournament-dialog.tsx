'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { TournamentForm } from '@/app/(admin)/admin/dashboard/tournaments/_components/tournament-form';

export function CreateTournamentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Torneio
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Torneio</DialogTitle>
        </DialogHeader>
        <TournamentForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
