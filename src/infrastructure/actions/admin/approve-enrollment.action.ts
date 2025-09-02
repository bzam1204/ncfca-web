'use server';

import { auth } from "@/infrastructure/auth";
import { Inject } from "@/infrastructure/containers/container";
import { UserRoles } from "@/domain/enums/user.roles";
import { revalidateTag } from "next/cache";
import { NextKeys } from "@/infrastructure/cache/next-keys";

export async function approveEnrollmentAction(clubId: string, enrollmentId: string) {
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    throw new Error('Acesso negado.');
  }

  const adminGateway = Inject.AdminGateway(session.accessToken);
  await adminGateway.approveEnrollment(clubId, enrollmentId);

  revalidateTag(NextKeys.admin.enrollments);
  revalidateTag(NextKeys.admin.clubMembers(clubId));
  revalidateTag(NextKeys.admin.clubCharts(clubId));
}