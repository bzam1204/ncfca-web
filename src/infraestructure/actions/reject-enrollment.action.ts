'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";

export async function rejectEnrollmentAction(enrollmentId: string, rejectionReason: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Acesso negado.');
  }

  const clubGateway = Inject.ClubGateway(session.accessToken);
  return clubGateway.rejectEnrollment(enrollmentId, { rejectionReason });
}