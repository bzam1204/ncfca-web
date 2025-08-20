'use server';

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function deleteTrainingAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const trainingGateway = Inject.TrainingGateway(session.accessToken);
  return trainingGateway.deleteTraining(id);
}
