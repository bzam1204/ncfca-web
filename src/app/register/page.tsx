// src/app/register/page.tsx
'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useEffect} from 'react';
import {Loader2} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {registerSchema, type RegisterInput} from '@/lib/validators/register.schema';
import {useRegisterUser} from "@/hooks/use-cases/use-register-user.use-case";
import {useCepAutocomplete} from "@/hooks/use-cep-autocomplete";

export default function RegisterPage() {
  const router = useRouter();
  const {mutate : register, isPending : isRegistering, error : registerError, isSuccess} = useRegisterUser();
  const {
    register : formRegister,
    handleSubmit,
    setValue,
    watch,
    formState : {errors},
  } = useForm<RegisterInput>({
    resolver : zodResolver(registerSchema),
    defaultValues : {
      address : {zipCode : ''}
    }
  });
  const {isLoading : isCepLoading, error : cepError, handleCepChange} = useCepAutocomplete(setValue);
  const cepValue = watch('address.zipCode');
  useEffect(() => {
    handleCepChange(cepValue);
  }, [cepValue, handleCepChange]);
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);
  const onSubmit = (data: RegisterInput) => {
    register(data);
  };
  return (
      <div className="flex items-center justify-center min-h-screen py-8">
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
                  <fieldset className="grid grid-cols-1 md:grid-cols-6 gap-4 border-t pt-4">
                    <legend className="text-lg font-semibold mb-2 col-span-1 md:col-span-6">Endereço</legend>
                    <div className="space-y-2 md:col-span-2 relative">
                      <Label htmlFor="address.zipCode">CEP</Label>
                      <Input id="address.zipCode" {...formRegister('address.zipCode')} />
                      {isCepLoading &&
                          <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-9 text-slate-400" />}
                      {errors.address?.zipCode &&
                          <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
                      {cepError && <p className="text-red-500 text-sm">{cepError}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-4">
                      <Label htmlFor="address.street">Rua</Label>
                      <Input id="address.street" {...formRegister('address.street')} />
                      {errors.address?.street &&
                          <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address.number">Número</Label>
                      <Input id="address.number" {...formRegister('address.number')} />
                      {errors.address?.number &&
                          <p className="text-red-500 text-sm">{errors.address.number.message}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-4">
                      <Label htmlFor="address.district">Bairro</Label>
                      <Input id="address.district" {...formRegister('address.district')} />
                      {errors.address?.district &&
                          <p className="text-red-500 text-sm">{errors.address.district.message}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-4">
                      <Label htmlFor="address.city">Cidade</Label>
                      <Input id="address.city" {...formRegister('address.city')} />
                      {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address.state">Estado (UF)</Label>
                      <Input id="address.state" {...formRegister('address.state')} />
                      {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
                    </div>
                  </fieldset>
                  <fieldset className="grid grid-cols-1 gap-4 border-t pt-4">
                    <legend className="text-lg font-semibold mb-2">Segurança</legend>
                    {/* ... Campos de senha permanecem os mesmos ... */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" {...formRegister('password')} />
                      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input id="confirmPassword" type="password" {...formRegister('confirmPassword')} />
                      {errors.confirmPassword &&
                          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                  </fieldset>
                  {registerError && <p className="text-red-500 text-sm">{registerError.message}</p>}
                  <Button type="submit" className="w-full" disabled={isRegistering}>
                    {isRegistering ? 'Registrando...' : 'Registrar'}
                  </Button>
                </form>
            )}
          </CardContent>
          {!isSuccess && (
              <CardFooter className="text-sm justify-center">
                <p>Já tem uma conta?{' '}
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
