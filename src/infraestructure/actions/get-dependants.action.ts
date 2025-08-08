'use server';

import {Dependant} from "@/domain/entities/dependant.entity";

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function GetDependantsAction(): Promise<Dependant[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.FamilyGateway(session.accessToken);
  return await gateway.getMyDependants();
}
