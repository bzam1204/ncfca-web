// src/app/dashboard/club-management/_components/create-club-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCreateClubMutation } from '@/hooks/use-cases/use-club-management.use-case';
import { useNotify } from '@/hooks/use-notify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const createClubSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  city: z.string().min(3, 'A cidade é obrigatória.'),
  state: z.string().length(2, 'O estado deve ser uma sigla de 2 letras (UF).').toUpperCase(),
});

type CreateClubInput = z.infer<typeof createClubSchema>;

export function CreateClubForm() {
  const { data: session, update: updateSession } = useSession();
  const { mutate: createClub, isPending } = useCreateClubMutation();
  const notify = useNotify();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateClubInput>({
    resolver: zodResolver(createClubSchema),
  });

  const onSubmit = (data: CreateClubInput) => {
    if (!session?.accessToken) {
      notify.error("Sessão inválida.");
      return;
    }
    createClub({ data, accessToken: session.accessToken }, {
      onSuccess: async () => {
        notify.success("Clube criado com sucesso! Atualizando sua sessão...");
        await updateSession();
        router.refresh();
      },
      onError: (error) => notify.error(error.message),
    });
  };

  return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crie o Seu Clube</CardTitle>
          <CardDescription>
            Você ainda não gerencia um clube. Preencha os dados abaixo para criar o seu.
          </CardDescription>
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
                <Input id="state" {...register('state')} />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Criar e Gerenciar Meu Clube
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}