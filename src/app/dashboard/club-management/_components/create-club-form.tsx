// src/app/dashboard/club-management/_components/create-club-form.tsx
'use client';

import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useSession} from 'next-auth/react';
import {useCreateClubMutation} from '@/application/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {CreateClubResponseDto} from '@/contracts/api/club-management.dto';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Loader2} from 'lucide-react';
import {StateCombobox} from "@/app/_components/state-combobox";

const createClubSchema = z.object({
  name : z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  city : z.string().min(3, 'A cidade é obrigatória.'),
  state : z.string().length(2, 'O estado deve ser uma sigla de 2 letras (UF).').toUpperCase(),
});

type CreateClubInput = z.infer<typeof createClubSchema>;

interface CreateClubFormProps {
  onSuccess: (response: CreateClubResponseDto) => void;
}

export function CreateClubForm({onSuccess}: CreateClubFormProps) {
  const {data : session} = useSession();
  const {mutate : createClub, isPending} = useCreateClubMutation();
  const notify = useNotify();

  const {register, handleSubmit, formState : {errors}, control} = useForm<CreateClubInput>({
    resolver : zodResolver(createClubSchema),
  });

  const onSubmit = (data: CreateClubInput) => {
    if (!session?.accessToken) {
      notify.error("Sessão inválida.");
      return;
    }
    createClub({data, accessToken : session.accessToken}, {
      onSuccess : onSuccess,
      onError : (error) => notify.error(error.message),
    });
  };

  return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crie o Seu Clube</CardTitle>
          <CardDescription>Preencha os dados abaixo para registrar seu clube na plataforma NCFCA.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Controller
                    control={control}
                    name="state"
                    render={({field}) => (
                        <StateCombobox
                            value={field.value}
                            onValueChange={field.onChange}
                        />
                    )}
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar e Gerenciar Meu Clube
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}