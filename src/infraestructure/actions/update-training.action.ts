'use server';

import {revalidateTag} from "next/cache";

import {UpdateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";

import {NextKeys} from "@/infraestructure/cache/next-keys";
import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function updateTrainingAction(id: string, dto: UpdateTrainingDto): Promise<TrainingDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const trainingGateway = Inject.TrainingGateway(session.accessToken);
  const training = await trainingGateway.updateTraining(id, dto);
  revalidateTag(NextKeys.trainings);
  return training;
}
