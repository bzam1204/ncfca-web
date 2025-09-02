'use server';

import {DependantDto} from "@/contracts/api/dependant.dto";

import {Inject} from "@/infrastructure/containers/container";
import {auth} from "@/infrastructure/auth";


export async function GetDependantsAction(): Promise<DependantDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.FamilyGateway(session.accessToken);
  return await gateway.getMyDependants();
}
