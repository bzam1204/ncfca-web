// src/app/(admin)/_components/change-director-dialog.tsx
'use client';

import { useState } from "react";
import { ClubDto } from "@/contracts/api/club.dto";
import { UserDto } from "@/contracts/api/user.dto";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface ChangeDirectorDialogProps {
  isOpen: boolean;
  club: ClubDto | null;
  users: UserDto[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (clubId: string, newDirectorId: string) => void;
}

export function ChangePrincipalDialog({ isOpen, club, users, isPending, onClose, onSubmit }: ChangeDirectorDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleFormSubmit = () => {
    if (club && selectedUserId) {
      onSubmit(club.id, selectedUserId);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar Diretor de {club?.name}</DialogTitle>
            <DialogDescription>
              Busque e selecione um novo usuário para assumir a direção deste clube.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Command>
              <CommandInput placeholder="Buscar usuário por nome ou email..." />
              <CommandList>
                <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                      <CommandItem
                          key={user.id}
                          value={`${user.firstName} ${user.lastName} ${user.email}`}
                          onSelect={() => setSelectedUserId(user.id)}
                          className={selectedUserId === user.id ? 'bg-accent' : ''}
                      >
                        {user.firstName} {user.lastName} ({user.email})
                      </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button onClick={handleFormSubmit} disabled={isPending || !selectedUserId}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
