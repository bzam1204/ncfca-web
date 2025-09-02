'use server';

import { MyEnrollmentRequestsDto } from '@/application/gateways/enrollment/enrollment.gateway.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function getMyEnrollmentRequestsAction(): Promise<MyEnrollmentRequestsDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.EnrollmentGateway(session.accessToken);
  return await gateway.myRequests();
}
