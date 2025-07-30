import {TrainingDto, CreateTrainingDto, UpdateTrainingDto} from "@/contracts/api/training.dto";

export interface TrainingGateway {
  getTrainings(): Promise<TrainingDto[]>;
  createTraining(dto: CreateTrainingDto): Promise<TrainingDto>;
  updateTraining(id: string, dto: UpdateTrainingDto): Promise<TrainingDto>;
  deleteTraining(id: string): Promise<void>;
}
