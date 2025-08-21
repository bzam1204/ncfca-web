'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";

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