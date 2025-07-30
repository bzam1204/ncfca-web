import {useEffect} from "react";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2} from "lucide-react";
import {z} from "zod";

import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {DependantType} from "@/domain/enums/dependant-type.enum";
import {Dependant} from "@/domain/entities/dependant.entity";
import {Sex} from "@/domain/enums/sex.enum";

import {dependantRelationshipTranslation, dependantTypeTranslation, sexTranslation} from "@/infraestructure/translations";

export function DependantForm({dependant, onSubmit, isPending, onClose}: DependantFormProps) {
  const isEditing = !!dependant;
  const {register, handleSubmit, formState : {errors}, control, reset} = useForm<DependantFormInput>({
    resolver : zodResolver(dependantFormSchema),
    defaultValues : {
      relationship : dependant?.relationship,
      birthdate : dependant?.birthdate ? new Date(dependant.birthdate).toISOString().substring(0, 10) : '',
      firstName : dependant?.firstName ?? '',
      lastName : dependant?.lastName ?? '',
      phone : dependant?.phone ?? '',
      email : dependant?.email ?? '',
      type : dependant?.type,
      sex : dependant?.sex,
    },
  });

 

  useEffect(() => {
    if (dependant) {
      reset({
        relationship : dependant.relationship,
        birthdate : new Date(dependant.birthdate).toISOString().substring(0, 10),
        firstName : dependant.firstName,
        lastName : dependant.lastName,
        phone : dependant.phone ?? '',
        email : dependant.email ?? '',
        sex : dependant.sex,
      });
    } else {
      reset({
        firstName : '', lastName : '', birthdate : '', email : '', phone : '',
        sex : undefined, relationship : undefined
      });
    }
  }, [dependant, reset]);
  const processSubmit = (data: DependantFormInput) => {
    const payload = {
      ...data,
      email : data.email,
      phone : data.phone || undefined,
    };
    onSubmit(payload);
  };

  function closeAndReset() {
    (onClose)();
    reset();
  }
  
  return (
      <DialogContent onPointerDownOutside={(e) => {
        if (isPending) e.preventDefault()
        closeAndReset();
      }} onEscapeKeyDown={(e) => {
        if (isPending) e.preventDefault()
      }}>
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
          <Controller
              control={control}
              name="sex"
              render={({field}) => (
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
          /> <Controller
            control={control}
            name="type"
            render={({field}) => (
                <div className="space-y-2 col-span-1">
                  <Label>Tipo</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(dependantTypeTranslation).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
            )}
        />
          <Controller
              control={control}
              name="relationship"
              render={({field}) => (
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
            <Label htmlFor="email">Email</Label>
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
          <Button type="button" variant="ghost" onClick={closeAndReset} disabled={isPending}>Cancelar</Button>
          <Button type="submit" form="dependant-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}

const dependantFormSchema = z.object({
  relationship : z.enum(DependantRelationship, {message : "Selecione um parentesco."}),
  birthdate : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato DD-MM-AAAA.'),
  firstName : z.string().min(2, 'O nome é obrigatório.'),
  lastName : z.string().min(2, 'O sobrenome é obrigatório.'),
  email : z.email({message : 'Email é obrigatório.'}),
  phone : z.string().optional(),
  type : z.enum(DependantType, {message : "Selecione um tipo de dependente."}),
  sex : z.enum(Sex, {message : "Selecione um sexo."}),
});
export type DependantFormInput = z.infer<typeof dependantFormSchema>;

interface DependantFormProps {
  dependant?: Dependant | null;
  onSubmit: (data: DependantFormInput) => void;
  isPending: boolean;
  onClose: () => void;
}
