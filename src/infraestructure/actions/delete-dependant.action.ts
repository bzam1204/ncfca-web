'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infraestructure/cache/next-keys";

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