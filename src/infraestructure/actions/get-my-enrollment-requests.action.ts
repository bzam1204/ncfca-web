'use server';

import {MyEnrollmentRequestsDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function getMyEnrollmentRequestsAction(): Promise<MyEnrollmentRequestsDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const getMyEnrollmentRequests = Inject.GetMyEnrollmentRequests(session.accessToken);
  return await getMyEnrollmentRequests.execute();
}
