'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotify } from '@/hooks/use-notify';
import { Club } from '@/domain/entities/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
// Importar o hook de mutation de update do admin (a ser criado)
// import { useAdminUpdateClubMutation } from '@/hooks/use-admin-update-club';

const editClubSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  city: z.string().min(3, 'A cidade é obrigatória.'),
  state: z.string().length(2, 'O estado deve ser uma sigla de 2 letras (UF).').toUpperCase(),
});

type EditClubInput = z.infer<typeof editClubSchema>;

interface AdminEditClubFormProps {
  club: Club;
  onSuccess: () => void;
}

export function AdminEditClubForm({ club, onSuccess }: AdminEditClubFormProps) {
  // const { mutate: updateClub, isPending } = useAdminUpdateClubMutation();
  const notify = useNotify();

  const { register, handleSubmit, formState: { errors } } = useForm<EditClubInput>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      name: club.name,
      city: club.address.city,
      state: club.address.state,
    }
  });

  const onSubmit = (data: EditClubInput) => {
    notify.error("Função de update do admin ainda não implementada.");
    // Exemplo de como seria a chamada:
    // updateClub({ clubId: club.id, data }, {
    //   onSuccess: () => {
    //     notify.success("Informações do clube atualizadas.");
    //     onSuccess();
    //   },
    //   onError: (error) => notify.error(error.message),
    // });
  };

  return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Informações do Clube (Admin)</DialogTitle>
          <DialogDescription>
            Atualize os dados deste clube.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Clube</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado (UF)</Label>
              <Input id="state" {...register('state')} />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={true/*isPending*/}>
              {false/*isPending*/ && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
  );
}