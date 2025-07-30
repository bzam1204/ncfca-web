import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {CreateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";

export class CreateTraining {
  constructor(private trainingGateway: TrainingGateway) {
  }

  async execute(dto: CreateTrainingDto): Promise<TrainingDto> {
    return await this.trainingGateway.createTraining(dto);
  }
}
