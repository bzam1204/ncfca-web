
'use server';

import {TrainingDto} from "@/contracts/api/training.dto";
import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function getTrainingsAction(): Promise<TrainingDto[]> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const getTrainings = Inject.GetTrainings(session.accessToken);
  return getTrainings.execute();
}
