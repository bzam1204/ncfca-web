'use server'

import {RequestEnrollmentDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function requestEnrollmentAction(input: RequestEnrollmentDto): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const requestEnrollment = Inject.RequestEnrollment(session.accessToken);
  return requestEnrollment.execute(input);
}
