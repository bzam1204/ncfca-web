// src/app/dashboard/dependants/_components/dependant-form.tsx
'use client';

import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {DependantResponseDto} from '@/contracts/api/dependant.dto';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {Loader2} from 'lucide-react';
import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {Sex} from "@/domain/enums/sex.enum";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {dependantRelationshipTranslation, sexTranslation} from "@/lib/translations";
import {useEffect} from "react";

const dependantFormSchema = z.object({
  relationship : z.enum(DependantRelationship, {message : "Selecione um parentesco."}),
  birthdate : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.'),
  firstName : z.string().min(2, 'O nome é obrigatório.'),
  lastName : z.string().min(2, 'O sobrenome é obrigatório.'),
  email : z.email({message : 'Email inválido.'}).optional().or(z.literal('')),
  phone : z.string().optional(),
  sex : z.enum(Sex, {message : "Selecione um sexo."}),
});

export type DependantFormInput = z.infer<typeof dependantFormSchema>;

interface DependantFormProps {
  dependant?: DependantResponseDto | null;
  onSubmit: (data: DependantFormInput) => void;
  isPending: boolean;
  onClose: () => void;
}

interface DependantFormProps {
  dependant?: DependantResponseDto | null;
  onSubmit: (data: DependantFormInput) => void;
  isPending: boolean;
  onClose: () => void;
}

export function DependantForm({ dependant, onSubmit, isPending, onClose }: DependantFormProps) {
  const isEditing = !!dependant;

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<DependantFormInput>({
    resolver: zodResolver(dependantFormSchema),
    // CORREÇÃO CRÍTICA: Os defaultValues agora lidam corretamente com todos os campos.
    defaultValues: {
      firstName: dependant?.firstName ?? '',
      lastName: dependant?.lastName ?? '',
      // Garante que a data esteja no formato 'AAAA-MM-DD' que o input type="date" espera.
      birthdate: dependant?.birthdate ? new Date(dependant.birthdate).toISOString().substring(0, 10) : '',
      relationship: dependant?.relationship,
      sex: dependant?.sex,
      email: dependant?.email ?? '',
      phone: dependant?.phone ?? '',
    },
  });

  useEffect(() => {
    if (dependant) {
      // Modo de edição: Preenche o formulário com os dados do dependente.
      reset({
        firstName: dependant.firstName,
        lastName: dependant.lastName,
        birthdate: new Date(dependant.birthdate).toISOString().substring(0, 10),
        relationship: dependant.relationship,
        sex: dependant.sex,
        email: dependant.email ?? '',
        
        phone: dependant.phone ?? '',
      });
    } else {
      // Modo de adição: Limpa o formulário.
      reset({
        firstName: '', lastName: '', birthdate: '', email: '', phone: '',
        sex: undefined, relationship: undefined
      });
    }
  }, [dependant, reset]);

  const processSubmit = (data: DependantFormInput) => {
    // Garante que campos opcionais vazios sejam enviados como undefined para a API.
    const payload = {
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
    };
    onSubmit(payload);
  };

  return (
      <DialogContent onPointerDownOutside={(e) => { if(isPending) e.preventDefault() }} onEscapeKeyDown={(e) => { if(isPending) e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Dependente' : 'Adicionar Dependente'}</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo. Clique em salvar para aplicar as mudanças.
          </DialogDescription>
        </DialogHeader>
        <form id="dependant-form" onSubmit={handleSubmit(processSubmit)} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-1">
            <Label htmlFor="firstName">Nome</Label>
            <Input id="firstName" {...register('firstName')} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input id="lastName" {...register('lastName')} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="birthdate">Data de Nascimento</Label>
            <Input id="birthdate" type="date" {...register('birthdate')} />
            {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate.message}</p>}
          </div>

          {/* CORREÇÃO: Uso do Controller para garantir a integração correta do Select */}
          <Controller
              control={control}
              name="sex"
              render={({ field }) => (
                  <div className="space-y-2 col-span-1">
                    <Label>Sexo</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(sexTranslation).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
                  </div>
              )}
          />

          <Controller
              control={control}
              name="relationship"
              render={({ field }) => (
                  <div className="space-y-2 col-span-1">
                    <Label>Parentesco</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(dependantRelationshipTranslation).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.relationship && <p className="text-red-500 text-sm">{errors.relationship.message}</p>}
                  </div>
              )}
          />
          <div className="space-y-2 col-span-2">
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input id="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="phone">Telefone (Opcional)</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

        </form>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button type="submit" form="dependant-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}