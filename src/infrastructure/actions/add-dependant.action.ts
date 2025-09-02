'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { AddDependantRequestDto } from "@/contracts/api/dependant.dto";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infrastructure/cache/next-keys";

export async function addDependantAction(data: AddDependantRequestDto) {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const familyGateway = Inject.FamilyGateway(session.accessToken);
  const result = await familyGateway.addDependant(data);
  
  // Revalidar cache dos dependentes
  revalidateTag(NextKeys.family.myDependants);
  
  return result;
}