import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {TrainingDto} from "@/contracts/api/training.dto";

export class GetTrainings {
  constructor(private trainingGateway: TrainingGateway) {
  }

  async execute(token: string): Promise<TrainingDto[]> {
    return await this.trainingGateway.getTrainings(token);
  }
}