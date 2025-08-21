'use client';

import { useMutation } from '@tanstack/react-query';
import { checkoutAction } from '@/infraestructure/actions/checkout.action';

interface CheckoutParams {
  paymentMethod: string;
  paymentToken: string;
}

export function useCheckout() {
  return useMutation({
    mutationFn: ({ paymentMethod, paymentToken }: CheckoutParams) => 
      checkoutAction({ paymentMethod, paymentToken }),
  });
}