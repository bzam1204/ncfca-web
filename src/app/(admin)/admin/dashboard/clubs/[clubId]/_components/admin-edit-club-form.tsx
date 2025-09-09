'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotify } from '@/hooks/misc/use-notify';
import { Club } from '@/domain/entities/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAdminUpdateClub } from '@/hooks/clubs/use-admin-update-club';
import { useCepAutocompleteGeneric } from '@/hooks/misc/use-cep-autocomplete-generic';
import { viaCepService } from '@/infrastructure/services/via-cep.service';
import { StateCombobox } from '@/app/_components/state-combobox';

const editClubSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  address: z.object({
    zipCode: z.string().length(8, 'CEP deve conter 8 caracteres.'),
    street: z.string().min(1, 'Rua é obrigatória.'),
    number: z.string().min(1, 'Número é obrigatório.'),
    district: z.string().min(1, 'Bairro é obrigatório.'),
    city: z.string().min(3, 'A cidade é obrigatória.'),
    state: z.string().length(2, 'O estado deve ser uma sigla de 2 letras (UF).').toUpperCase(),
  }),
  maxMembers: z
    .string()
    .optional()
    .refine((val) => !val || /^[1-9]\d*$/.test(val), {
      message: 'Deve ser um número positivo.',
    }),
});

type EditClubInput = z.infer<typeof editClubSchema>;

interface AdminEditClubFormProps {
  club: Club;
  onSuccess: () => void;
}

export function AdminEditClubForm({ club, onSuccess }: AdminEditClubFormProps) {
  const { mutate: updateClub, isPending } = useAdminUpdateClub(club.id);
  const notify = useNotify();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<EditClubInput>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      name: club.name,
      address: {
        zipCode: club.address.zipCode || '',
        street: club.address.street || '',
        number: club.address.number || '',
        district: club.address.district || '',
        city: club.address.city || '',
        state: club.address.state || '',
      },
      maxMembers: club.maxMembers?.toString() || '',
    },
  });

  const { handleCepChange, isLoadingCep, errorCep } = useCepAutocompleteGeneric(setValue, viaCepService, 'address');

  const cepValue = watch('address.zipCode');

  const onSubmit = (data: EditClubInput) => {
    const payload = {
      name: data.name,
      maxMembers: data.maxMembers ? Number(data.maxMembers) : null,
      address: data.address,
    };

    updateClub(
      { clubId: club.id, payload },
      {
        onSuccess: () => {
          notify.success('Informações do clube atualizadas.');
          onSuccess();
        },
        onError: (error) => notify.error(error.message),
      },
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Informações do Clube (Admin)</DialogTitle>
        <DialogDescription>Atualize os dados deste clube.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Clube</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <fieldset className="grid grid-cols-1 md:grid-cols-6 gap-4 border-t pt-4">
          <legend className="text-lg font-semibold mb-2 col-span-1 md:col-span-6">Endereço</legend>
          <div className="space-y-2 md:col-span-2 relative">
            <Label htmlFor="address.zipCode">CEP</Label>
            <Input id="address.zipCode" {...register('address.zipCode')} onBlur={() => handleCepChange(cepValue)} />
            {isLoadingCep && <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-9 text-slate-400" />}
            {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
            {errorCep && <p className="text-red-500 text-sm">{errorCep}</p>}
          </div>
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor="address.street">Rua</Label>
            <Input id="address.street" {...register('address.street')} />
            {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address.number">Número</Label>
            <Input id="address.number" {...register('address.number')} />
            {errors.address?.number && <p className="text-red-500 text-sm">{errors.address.number.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor="address.district">Bairro</Label>
            <Input id="address.district" {...register('address.district')} />
            {errors.address?.district && <p className="text-red-500 text-sm">{errors.address.district.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="address.city">Cidade</Label>
            <Input id="address.city" {...register('address.city')} />
            {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="address.state">Estado</Label>
            <Controller
              control={control}
              name="address.state"
              render={({ field }) => <StateCombobox value={field.value} onValueChange={field.onChange} />}
            />
            {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
          </div>
        </fieldset>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxMembers" className="text-right">
            Nº Máximo de Membros
          </Label>
          <Input id="maxMembers" type="text" inputMode="numeric" pattern="[0-9]*" {...register('maxMembers')} className="col-span-3" />
          {errors.maxMembers && <p className="col-span-4 text-red-500 text-sm">{errors.maxMembers.message}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
