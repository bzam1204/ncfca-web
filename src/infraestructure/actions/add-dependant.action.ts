'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { AddDependantRequestDto } from "@/contracts/api/dependant.dto";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infraestructure/cache/next-keys";

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