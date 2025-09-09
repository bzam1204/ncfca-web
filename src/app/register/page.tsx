'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, type RegisterInput } from '@/infrastructure/validators/register.schema';
import { useRegisterUserMutation } from '@/hooks/users/use-register-user';
import { useCepAutocomplete } from '@/hooks/misc/use-cep-autocomplete';
import { viaCepService } from '@/infrastructure/services/via-cep.service';
import { useNotify } from '@/hooks/misc/use-notify';
import { useEffect } from 'react';
import { StateCombobox } from '@/app/_components/state-combobox';

export default function RegisterPage() {
  const router = useRouter();
  const notify = useNotify();
  const { mutate: register, isPending: isRegistering, error: registerError, isSuccess } = useRegisterUserMutation();
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      address: { zipCode: '' },
    },
  });
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);
  useEffect(() => {
    if (!registerError) return;
    notify.error(registerError.message || 'Erro ao registrar usuário');
  }, [registerError, notify]);
  const onSubmit = (data: RegisterInput) => {
    register({ userData: data });
  };
  return (
    <div className="flex items-start justify-center max-h-screen py-8 px-2 overflow-y-auto">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>Preencha os campos para se registrar.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center text-green-600">
              <p>Registro concluído com sucesso!</p>
              <p>Você será redirecionado para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <fieldset className="grid grid-cols-2 gap-4">
                <legend className="text-lg font-semibold mb-2 col-span-2">Dados Pessoais</legend>
                {/* ... Campos de Dados Pessoais permanecem os mesmos ... */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" {...formRegister('firstName')} />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" {...formRegister('lastName')} />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...formRegister('email')} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...formRegister('phone')} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" {...formRegister('cpf')} />
                  {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
                </div>
              </fieldset>
              <Endereco watch={watch} errors={errors} formRegister={formRegister} setValue={setValue} control={control} />
              <fieldset className="grid grid-cols-1 gap-4 border-t pt-4">
                <legend className="text-lg font-semibold mb-2">Segurança</legend>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" {...formRegister('password')} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" type="password" {...formRegister('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
              </fieldset>
              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? 'Registrando...' : 'Registrar'}
              </Button>
            </form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="text-sm justify-center">
            <p>
              Já tem uma conta?{' '}
              <Link href="/login" className="underline font-semibold">
                Faça o login
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function Endereco(input: { formRegister: any; setValue: any; watch: any; errors: any; control: any }) {
  const { handleCepChange, isLoadingCep, errorCep } = useCepAutocomplete(input.setValue, viaCepService);
  const cepValue = input.watch('address.zipCode');
  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-6 gap-4 border-t pt-4">
      <legend className="text-lg font-semibold mb-2 col-span-1 md:col-span-6">Endereço</legend>
      <div className="space-y-2 md:col-span-2 relative">
        <Label htmlFor="address.zipCode">CEP</Label>
        <Input id="address.zipCode" {...input.formRegister('address.zipCode')} onBlur={() => handleCepChange(cepValue)} />
        {isLoadingCep && <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-9 text-slate-400" />}
        {input.errors.address?.zipCode && <p className="text-red-500 text-sm">{input.errors.address.zipCode.message}</p>}
        {errorCep && <p className="text-red-500 text-sm">{errorCep}</p>}
      </div>
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="address.street">Rua</Label>
        <Input id="address.street" {...input.formRegister('address.street')} />
        {input.errors.address?.street && <p className="text-red-500 text-sm">{input.errors.address.street.message}</p>}
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address.number">Número</Label>
        <Input id="address.number" {...input.formRegister('address.number')} />
        {input.errors.address?.number && <p className="text-red-500 text-sm">{input.errors.address.number.message}</p>}
      </div>
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="address.district">Bairro</Label>
        <Input id="address.district" {...input.formRegister('address.district')} />
        {input.errors.address?.district && <p className="text-red-500 text-sm">{input.errors.address.district.message}</p>}
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label htmlFor="address.city">Cidade</Label>
        <Input id="address.city" {...input.formRegister('address.city')} />
        {input.errors.address?.city && <p className="text-red-500 text-sm">{input.errors.address.city.message}</p>}
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label htmlFor="address.city">Estado</Label>
        <Controller
          control={input.control}
          name="address.state"
          render={({ field }) => <StateCombobox value={field.value} onValueChange={field.onChange} />}
        />
        {input.errors.address?.state && <p className="text-red-500 text-sm">{input.errors.address.state.message}</p>}
      </div>
    </fieldset>
  );
}
