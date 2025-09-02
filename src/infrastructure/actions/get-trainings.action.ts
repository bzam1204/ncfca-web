'use server';

import { TrainingDto } from '@/contracts/api/training.dto';

import { auth } from '@/infrastructure/auth';
import { Inject } from '@/infrastructure/containers/container';

export async function getTrainingsAction(): Promise<TrainingDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const trainingGateway = Inject.TrainingGateway(session.accessToken);
  return await trainingGateway.getTrainings(session.accessToken);
}
