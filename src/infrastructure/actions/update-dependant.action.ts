'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { UpdateDependantRequestDto } from "@/contracts/api/dependant.dto";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infrastructure/cache/next-keys";

export async function updateDependantAction(dependantId: string, data: UpdateDependantRequestDto) {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const familyGateway = Inject.FamilyGateway(session.accessToken);
  const result = await familyGateway.updateDependant(dependantId, data);
  
  // Revalidar cache dos dependentes
  revalidateTag(NextKeys.family.myDependants);
  
  return result;
}