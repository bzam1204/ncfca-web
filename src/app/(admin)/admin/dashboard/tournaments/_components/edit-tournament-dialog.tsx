'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useTournamentDetails } from '@/hooks/tournaments/use-tournament-details';
import { TournamentForm } from '@/app/(admin)/admin/dashboard/tournaments/_components/tournament-form';

export function EditTournamentDialog({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { tournament, isLoading } = useTournamentDetails(id);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Torneio</DialogTitle>
        </DialogHeader>
        {isLoading || !tournament ? null : (
          <TournamentForm tournament={tournament} onSuccess={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
