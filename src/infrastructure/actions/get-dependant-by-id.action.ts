'use server';

import {DependantDto} from "@/contracts/api/dependant.dto";

import {Inject} from '@/infrastructure/containers/container';
import {auth} from '@/infrastructure/auth';

export async function getDependantByIdAction(dependantId: string): Promise<DependantDto | null> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Acesso negado.');
  const familyGateway = Inject.FamilyGateway(session.accessToken);
  const dependant = await familyGateway.getDependantById(dependantId);
  return dependant;
}
