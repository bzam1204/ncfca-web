import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {UpdateTrainingDto, TrainingDto} from "@/contracts/api/training.dto";

export class UpdateTraining {
  constructor(private trainingGateway: TrainingGateway) {
  }

  async execute(id: string, dto: UpdateTrainingDto): Promise<TrainingDto> {
    return await this.trainingGateway.updateTraining(id, dto);
  }
}
