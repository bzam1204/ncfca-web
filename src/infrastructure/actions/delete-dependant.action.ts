'use server';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';
import { revalidateTag } from 'next/cache';
import { NextKeys } from '@/infrastructure/cache/next-keys';

export async function deleteDependantAction(dependantId: string) {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const familyGateway = Inject.FamilyGateway(session.accessToken);
  await familyGateway.deleteDependant(dependantId);

  // Revalidar cache dos dependentes
  revalidateTag(NextKeys.family.myDependants);
}
