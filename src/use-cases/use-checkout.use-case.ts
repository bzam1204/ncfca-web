// src/hooks/use-cases/useCheckout.ts
import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';

interface CheckoutPayload {
  paymentMethod: 'CREDIT_CARD'; // Por agora, apenas cartão
  paymentToken: string;
  accessToken: string;
}

const performCheckout = async (payload: CheckoutPayload) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  // O token de sessão será enviado automaticamente pelo browser (se estiver a usar cookies)
  // ou precisa ser adicionado manualmente se estiver a usar um interceptor de fetch.
  // Por agora, vamos assumir que o back-end o obtém da sessão.
  const res = await fetch(`${BACKEND_URL}/checkout`, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Falha no processo de pagamento.');
  }

  return res.json();
};

export const useCheckout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn : performCheckout,
    onSuccess : () => {
      // Após o pagamento bem-sucedido, invalida o cache e redireciona.
      router.refresh();
      router.push('/dashboard');
    },
  });
};
