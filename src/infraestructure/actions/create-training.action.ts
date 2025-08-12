'use server';

import {CreateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function createTrainingAction(dto: CreateTrainingDto): Promise<TrainingDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.TrainingGateway(session.accessToken);
  return gateway.createTraining(dto);
}
