import {TrainingGateway} from "@/application/gateways/training/training.gateway";

export class DeleteTraining {
  constructor(private trainingGateway: TrainingGateway) {
  }

  async execute(id: string): Promise<void> {
    return await this.trainingGateway.deleteTraining(id);
  }
}
