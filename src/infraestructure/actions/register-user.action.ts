'use server';

import { Inject } from "@/infraestructure/containers/container";
import { RegisterUserRequestDto } from "@/contracts/api/auth.dto";

export async function registerUserAction(userData: RegisterUserRequestDto) {
  const authGateway = Inject.AuthGateway();
  return authGateway.register(userData);
}