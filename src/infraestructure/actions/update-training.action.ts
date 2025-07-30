
'use server';

import {UpdateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";
import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function updateTrainingAction(id: string, dto: UpdateTrainingDto): Promise<TrainingDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const updateTraining = Inject.UpdateTraining(session.accessToken);
  return updateTraining.execute(id, dto);
}
