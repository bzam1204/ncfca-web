'use server';

import { auth } from "@/infrastructure/auth";
import { Dependant } from "@/domain/entities/dependant.entity";
import { Inject } from "@/infrastructure/containers/container";

export async function getDependantByIdAction(dependantId: string): Promise<Dependant> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const familyGateway = Inject.FamilyGateway(session.accessToken);
  return familyGateway.getDependantById(dependantId);
}