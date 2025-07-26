'use client';

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useCheckout} from "@/use-cases/use-checkout.use-case";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {router} from "next/client";

export default function CheckoutPage() {
  const {mutate : checkout, isPending, error} = useCheckout();
  const {data : session, status} = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);
  const handlePayment = () => {
    const accessToken = session?.accessToken
    if (!accessToken) {
      alert("Erro de autenticação. Por favor, faça o login novamente.");
      return;
    }
    checkout({
      paymentMethod : 'CREDIT_CARD',
      paymentToken : 'valid-token',
      accessToken : accessToken,
    });
  };
  return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Afiliação NCFCA</CardTitle>
            <CardDescription>
              A sua família precisa de uma afiliação ativa para aceder ao dashboard e
              matricular dependentes em clubes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold mb-4">R$ 500,00 / ano</p>
            <Button onClick={handlePayment} disabled={isPending} className="w-full">
              {isPending ? 'Processando...' : 'Pagar com Cartão de Crédito (Simulado)'}
            </Button>
            {error && <p className="text-red-500 text-sm mt-4">{error.message}</p>}
          </CardContent>
        </Card>
      </div>
  );
}
