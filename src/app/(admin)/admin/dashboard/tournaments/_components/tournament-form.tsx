'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  CreateTournamentDto,
  TournamentResponseDto,
  TournamentType,
  UpdateTournamentDto,
  TournamentDetailsView,
} from '@/contracts/api/tournament.dto';
import { useCreateTournament } from '@/hooks/tournaments/use-create-tournament';
import { useUpdateTournament } from '@/hooks/tournaments/use-update-tournament';
import { DateTimePicker } from '@/components/ui/date-time-picker';

export function TournamentForm({ tournament, onSuccess }: Props) {
  const isEditing = !!tournament;
  const createMutation = useCreateTournament();
  const updateMutation = useUpdateTournament();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: tournament?.name || '',
      description: tournament?.description || '',
      type: (tournament?.type as TournamentType) || 'INDIVIDUAL',
      registrationStartDate: tournament?.registrationStartDate?.slice(0, 16) || '',
      registrationEndDate: tournament?.registrationEndDate?.slice(0, 16) || '',
      startDate: tournament?.startDate?.slice(0, 16) || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        registrationStartDate: new Date(data.registrationStartDate).toISOString(),
        registrationEndDate: new Date(data.registrationEndDate).toISOString(),
        startDate: new Date(data.startDate).toISOString(),
      };
      if (isEditing && tournament) {
        const dto: UpdateTournamentDto = payload;
        await updateMutation.mutateAsync({ id: tournament.id, dto });
      } else {
        const dto: CreateTournamentDto = payload as CreateTournamentDto;
        await createMutation.mutateAsync(dto);
      }
      onSuccess();
      form.reset();
    } catch (err) {
      console.error('Erro ao salvar torneio:', err);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do torneio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do torneio" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="DUO">Dupla</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="registrationStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início das Inscrições</FormLabel>
                <FormControl>
                  <DateTimePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim das Inscrições</FormLabel>
                <FormControl>
                  <DateTimePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início do Torneio</FormLabel>
                <FormControl>
                  <DateTimePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (isEditing ? 'Atualizando...' : 'Criando...') : isEditing ? 'Atualizar Torneio' : 'Criar Torneio'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const schema = z
  .object({
    name: z.string().min(3, 'Nome é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    type: z.enum(['INDIVIDUAL', 'DUO']),
    registrationStartDate: z.string().min(1, 'Obrigatório'),
    registrationEndDate: z.string().min(1, 'Obrigatório'),
    startDate: z.string().min(1, 'Obrigatório'),
  })
  .refine((data) => new Date(data.registrationStartDate) <= new Date(data.registrationEndDate), {
    message: 'Início da inscrição deve ser antes do fim',
    path: ['registrationStartDate'],
  })
  .refine((data) => new Date(data.registrationEndDate) <= new Date(data.startDate), {
    message: 'Fim da inscrição deve ser antes do início do torneio',
    path: ['registrationEndDate'],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  tournament?: TournamentDetailsView | TournamentResponseDto;
  onSuccess: () => void;
}
