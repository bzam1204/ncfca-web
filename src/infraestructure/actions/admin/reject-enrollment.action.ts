'use server';

import { auth } from "@/infraestructure/auth";
import { Inject } from "@/infraestructure/containers/container";
import { UserRoles } from "@/domain/enums/user.roles";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infraestructure/cache/next-keys";

export async function rejectEnrollmentAction(clubId: string, enrollmentId: string, payload?: { rejectionReason?: string }) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  await adminGateway.rejectEnrollment(clubId, enrollmentId, payload);

  revalidateTag(NextKeys.admin.enrollments);
  revalidateTag(NextKeys.admin.clubCharts(clubId));
}