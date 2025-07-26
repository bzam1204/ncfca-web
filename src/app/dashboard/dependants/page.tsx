// src/app/dashboard/dependants/page.tsx
'use client';

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import {DependantResponseDto} from '@/contracts/api/dependant.dto';
import {
  useAddDependantMutation,
  useUpdateDependantMutation,
  useDeleteDependantMutation
} from '@/use-cases/use-manage-dependants.use-case';
import {useNotify} from '@/hooks/use-notify';

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, PlusCircle, AlertTriangle} from "lucide-react";
import {Skeleton} from '@/components/ui/skeleton';
import {DependantForm, DependantFormInput} from "@/app/_components/dependant-form";
import {DeleteConfirmationDialog} from "@/app/_components/delete-confirmation-dialog";

async function getDependants(accessToken: string): Promise<DependantResponseDto[]> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!accessToken) throw new Error("Token de autenticação não encontrado.");

  const res = await fetch(`${BACKEND_URL}/dependants`, {headers : {'Authorization' : `Bearer ${accessToken}`}});
  if (!res.ok) throw new Error('Falha ao carregar a lista de dependentes.');
  return res.json();
}

const TableSkeleton = () => (
    <div className="space-y-2 mt-4">
      <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" />
    </div>
);

export default function DependantsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedDependant, setSelectedDependant] = useState<DependantResponseDto | null>(null);

  const notify = useNotify();
  const {data : session} = useSession({required : true});
  const accessToken = session?.accessToken ?? '';

  const {mutate : addDependant, isPending : isAdding} = useAddDependantMutation();
  const {mutate : updateDependant, isPending : isUpdating} = useUpdateDependantMutation();
  const {mutate : deleteDependant, isPending : isDeleting} = useDeleteDependantMutation();

  const isMutating = isAdding || isUpdating || isDeleting;

  const {data : dependants = [], isLoading, error} = useQuery({
    queryKey : ['dependants'],
    queryFn : () => getDependants(accessToken),
    enabled : !!accessToken,
  });

  const handleFormSubmit = (data: DependantFormInput) => {
    const onSuccess = () => {
      notify.success(`Dependente ${selectedDependant ? 'atualizado' : 'adicionado'} com sucesso!`);
      closeForm();
    };
    const onError = (e: Error) => notify.error(e.message);

    if (selectedDependant) {
      updateDependant({id : selectedDependant.id, data, accessToken}, {onSuccess, onError});
    } else {
      addDependant({data, accessToken}, {onSuccess, onError});
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedDependant) return;
    deleteDependant({id : selectedDependant.id, accessToken}, {
      onSuccess : () => {
        notify.success('Dependente excluído com sucesso!');
        closeDeleteConfirm();
      },
      onError : (e: Error) => notify.error(e.message),
    });
  };

  const openForm = (dependant: DependantResponseDto | null = null) => {
    setSelectedDependant(dependant);
    setIsFormOpen(true);
  };
  const closeForm = () => setIsFormOpen(false);

  const openDeleteConfirm = (dependant: DependantResponseDto) => {
    setSelectedDependant(dependant);
    setIsDeleteConfirmOpen(true);
  };
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dependentes</CardTitle>
              <CardDescription>Gestão dos membros da sua família.</CardDescription>
            </div>
            <Button onClick={() => openForm()} disabled={isMutating}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Dependente
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading && <TableSkeleton />}
            {error && (
                <div className="text-center py-10 text-red-500">
                  <AlertTriangle className="mx-auto h-12 w-12" />
                  <p className="mt-4">Erro ao carregar dependentes.</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
            )}
            {!isLoading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Idade</TableHead>
                      <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dependants.length > 0 ? (
                        dependants.map((d) => (
                            <TableRow key={d.id}>
                              <TableCell className="font-medium">{`${d.firstName} ${d.lastName}`}</TableCell>
                              <TableCell className="hidden md:table-cell">{d.email || 'N/A'}</TableCell>
                              <TableCell className="hidden md:table-cell">{calculateAge(d.birthdate)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isMutating}>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => openForm(d)}>Editar</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600"
                                                      onClick={() => openDeleteConfirm(d)}>Excluir</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">Nenhum dependente encontrado.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DependantForm
              dependant={selectedDependant}
              onSubmit={handleFormSubmit}
              isPending={isAdding || isUpdating}
              onClose={closeForm}
          />
        </Dialog>
        <DeleteConfirmationDialog
            isOpen={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
            onConfirm={handleDeleteConfirm}
            isPending={isDeleting}
        />
      </>
  );
}