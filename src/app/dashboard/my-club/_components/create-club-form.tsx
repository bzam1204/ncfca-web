'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { StateCombobox } from '@/app/_components/state-combobox';
import { useCreateClubRequest } from '@/hooks/use-create-club-request';
import { useCepAutocompleteGeneric } from '@/hooks/use-cep-autocomplete-generic';
import { viaCepService } from '@/infrastructure/services/via-cep.service';

const addressSchema = z.object({
  street: z.string().min(3, 'A rua é obrigatória.'),
  number: z.string().min(1, 'O número é obrigatório.'),
  district: z.string().min(3, 'O bairro é obrigatório.'),
  city: z.string().min(3, 'A cidade é obrigatória.'),
  state: z.string().length(2, 'UF inválida.'),
  zipCode: z.string().length(8, 'CEP inválido. Use 8 dígitos.'),
});

const createClubRequestSchema = z.object({
  clubName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  maxMembers: z.number().min(1, 'Mínimo de 1 membro.'),
  address: addressSchema,
});

type CreateClubRequestInput = z.infer<typeof createClubRequestSchema>;

export function CreateClubForm() {
  const { mutate: createRequest, isPending } = useCreateClubRequest();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<CreateClubRequestInput>({
    resolver: zodResolver(createClubRequestSchema),
  });

  const { handleCepChange, isLoadingCep, errorCep } = useCepAutocompleteGeneric(setValue, viaCepService, 'address');

  const cepValue = watch('address.zipCode');

  const onSubmit = (data: CreateClubRequestInput) => createRequest(data);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicite a Criação do Seu Clube</CardTitle>
        <CardDescription>Preencha os dados abaixo. Sua solicitação será analisada por um administrador.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clubName">Nome do Clube</Label>
            <Input id="clubName" {...register('clubName')} />
            {errors.clubName && <p className="text-red-500 text-sm">{errors.clubName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Número Máximo de Membros</Label>
            <Input id="maxMembers" type="number" {...register('maxMembers', { valueAsNumber: true })} />
            {errors.maxMembers && <p className="text-red-500 text-sm">{errors.maxMembers.message}</p>}
          </div>

          <fieldset className="space-y-4 border p-4 rounded-md">
            <legend className="text-sm font-medium px-1">Endereço do Clube</legend>

            <div className="space-y-2 relative">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" {...register('address.zipCode')} onBlur={() => handleCepChange(cepValue)} />
              {isLoadingCep && <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-9 text-slate-400" />}
              {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
              {errorCep && <p className="text-red-500 text-sm">{errorCep}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Rua / Avenida</Label>
                <Input id="street" {...register('address.street')} />
                {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register('address.number')} />
                {errors.address?.number && <p className="text-red-500 text-sm">{errors.address.number.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">Bairro</Label>
                <Input id="district" {...register('address.district')} />
                {errors.address?.district && <p className="text-red-500 text-sm">{errors.address.district.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register('address.city')} />
                {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado (UF)</Label>
              <Controller
                control={control}
                name="address.state"
                render={({ field }) => <StateCombobox value={field.value} onValueChange={field.onChange} />}
              />
              {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
            </div>
          </fieldset>

          <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Solicitação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
