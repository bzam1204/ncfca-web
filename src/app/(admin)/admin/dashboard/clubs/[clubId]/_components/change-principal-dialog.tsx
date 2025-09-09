'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Club } from '@/domain/entities/entities';
import { useChangePrincipal } from '@/hooks/clubs/use-change-principal';
import { useSearchUsers } from '@/hooks/users/use-search-users';
import { useDebounce } from '@/hooks/misc/use-debounce';

interface ChangePrincipalDialogProps {
  isOpen: boolean;
  club: Club | null;
  onClose: () => void;
}

export function ChangePrincipalDialog({ isOpen, club, onClose }: ChangePrincipalDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const changePrincipalMutation = useChangePrincipal();
  const shouldSearch = hasSearched && Boolean(debouncedSearchQuery?.trim());
  const { data: searchResult, isLoading: isSearching } = useSearchUsers({ name: debouncedSearchQuery }, shouldSearch);

  const users = searchResult?.data || [];

  // Track when user starts searching
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && !hasSearched) {
      setHasSearched(true);
    }
    if (!value.trim()) {
      setHasSearched(false);
      setSelectedUserId('');
    }
  };

  const handleFormSubmit = () => {
    if (club && selectedUserId) {
      changePrincipalMutation.mutate(
        { clubId: club.id, newPrincipalId: selectedUserId },
        {
          onSuccess: () => {
            onClose();
            setSelectedUserId('');
            setSearchQuery('');
            setHasSearched(false);
          },
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Diretor de {club?.name}</DialogTitle>
          <DialogDescription>Busque e selecione um novo usuário para assumir a direção deste clube.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Command>
            <CommandInput placeholder="Buscar usuário por nome ou email..." value={searchQuery} onValueChange={handleSearchChange} />
            <CommandList className="h-[200px] overflow-y-auto">
              <CommandEmpty className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
                {!hasSearched ? (
                  <div className="space-y-2 flex justify-center items-center flex-col py-8">
                    <p>Digite o nome ou email para buscar usuários</p>
                    <p className="text-xs">Comece digitando para ver os resultados</p>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Buscando usuários...</span>
                  </div>
                ) : debouncedSearchQuery?.trim() ? (
                  <div className="space-y-2">
                    <p>Nenhum usuário encontrado</p>
                    <p className="text-xs">Tente buscar com um termo diferente</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Digite o nome ou email para buscar usuários</p>
                    <p className="text-xs">Comece digitando para ver os resultados</p>
                  </div>
                )}
              </CommandEmpty>
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
          <Button variant="ghost" onClick={onClose} disabled={changePrincipalMutation.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleFormSubmit} disabled={changePrincipalMutation.isPending || !selectedUserId}>
            {changePrincipalMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
