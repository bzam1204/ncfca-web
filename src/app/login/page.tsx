// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginSchema, type LoginInput } from '@/infrastructure/validators/login.schema';
import { useNotify } from '@/hooks/use-notify';
import { Skeleton } from '@/components/ui/skeleton';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const notify = useNotify(); // 2. Instanciar o hook

  // 3. Usar useEffect para mostrar o erro da URL como um toast
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'CredentialsSignin') {
      notify.error('Credenciais inválidas. Verifique seu email e senha.');
    }
  }, [searchParams, notify]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: '/dashboard',
    });
    // Em caso de falha, o NextAuth redireciona de volta para esta página com o parâmetro de erro,
    // que o useEffect acima irá capturar.
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Acesse sua conta para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... campos do formulário ... */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {/* O erro agora é um toast, podemos remover a exibição de texto aqui */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Aguarde...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm justify-center">
          <p>
            Não tem uma conta?{' '}
            <Link href="/register" className="underline font-semibold">
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Login />
    </Suspense>
  );
}
