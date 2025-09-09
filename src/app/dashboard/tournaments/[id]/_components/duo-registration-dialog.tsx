'use client';

import { PropsWithChildren, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { TournamentDetailsView } from '@/contracts/api/tournament.dto';

import { useGetDependants } from '@/hooks/family/use-get-dependants';
import { useDebounce } from '@/hooks/misc/use-debounce';
import { useSearchDependants } from '@/hooks/family/use-search-dependants';
import { useRequestDuoRegistration } from '@/hooks/registrations/use-request-duo-registration';

export function DuoRegistrationDialog({ tournament, disabled, children }: PropsWithChildren<{ tournament: TournamentDetailsView; disabled?: boolean }>) {
  const [open, setOpen] = useState(false);
  const [selectedDependantId, setSelectedDependantId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

  const dependantsQuery = useGetDependants();
  const dependants = dependantsQuery.data ?? [];

  const debouncedSearch = useDebounce(searchQuery, 500);
  const shouldSearch = hasSearched && Boolean(debouncedSearch?.trim());
  const { data: searchResult, isLoading: isSearching } = useSearchDependants({ email: debouncedSearch }, shouldSearch, { page: 1, limit: 10 });
  const partners = useMemo(() => searchResult?.data ?? [], [searchResult]);

  const { mutate, isPending } = useRequestDuoRegistration();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // reset
      setSelectedDependantId('');
      setSearchQuery('');
      setHasSearched(false);
      setSelectedPartnerId('');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && !hasSearched) setHasSearched(true);
    if (!value.trim()) {
      setHasSearched(false);
      setSelectedPartnerId('');
    }
  };

  const handleSubmit = () => {
    if (!selectedDependantId || !selectedPartnerId || !tournament?.id) return;
    mutate(
      { tournamentId: tournament.id, competitorId: selectedDependantId, partnerId: selectedPartnerId },
      {
        onSuccess: () => handleOpenChange(false),
      },
    );
  };

  const disableSubmit = isPending || !selectedDependantId || !selectedPartnerId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrição em Dupla</DialogTitle>
          <DialogDescription>
            Selecione o dependente e busque o parceiro por e-mail para inscrever no torneio &quot;{tournament.name}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="space-y-2">
            <Label>Buscar Parceiro por E-mail</Label>
            <Command>
              <CommandInput placeholder="Digite o e-mail do parceiro..." value={searchQuery} onValueChange={handleSearchChange} />
              <CommandList className="h-[200px] overflow-y-auto">
                <CommandEmpty className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
                  {!hasSearched ? (
                    <div className="space-y-2 flex justify-center items-center flex-col py-8">
                      <p>Digite um e-mail para buscar</p>
                      <p className="text-xs">Comece digitando para ver os resultados</p>
                    </div>
                  ) : isSearching ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Buscando dependentes...</span>
                    </div>
                  ) : debouncedSearch?.trim() && partners.length === 0 ? (
                    <div className="space-y-2">
                      <p>Nenhum dependente encontrado</p>
                      <p className="text-xs">Tente um e-mail diferente</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>Digite um e-mail para buscar</p>
                      <p className="text-xs">Comece digitando para ver os resultados</p>
                    </div>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {partners.map((p) => (
                    <CommandItem
                      key={p.id}
                      value={`${p.name} ${p.email}`}
                      onSelect={() => setSelectedPartnerId(p.id)}
                      className={selectedPartnerId === p.id ? 'bg-accent' : ''}
                    >
                      {p.name} ({p.email})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={disableSubmit}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Inscrição em Dupla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
