'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';

interface CheckoutParams {
  paymentMethod: string;
  paymentToken: string;
}

export async function checkoutAction(params: CheckoutParams): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const familyGateway = Inject.FamilyGateway(session.accessToken);
  return familyGateway.checkout(params);
}
