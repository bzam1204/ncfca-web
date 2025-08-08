import {TrainingDto, CreateTrainingDto, UpdateTrainingDto} from "@/contracts/api/training.dto";

import {TrainingGateway} from "@/application/gateways/training/training.gateway";

import {NextKeys} from "@/infraestructure/cache/next-keys";

export class TrainingGatewayApi implements TrainingGateway {
  constructor(private readonly baseUrl: string, private readonly accessToken: string) {
  }

  async getTrainings(token: string): Promise<TrainingDto[]> {
    const res = await fetch(`${this.baseUrl}/trainings`, {
      headers : {'Authorization' : `Bearer ${token}`},
      cache : 'default',
      next : {
        tags : [NextKeys.trainings]
      }
    });
    if (!res.ok) throw new Error('Falha ao buscar treinamentos.');
    return res.json();
  }

  async createTraining(dto: CreateTrainingDto): Promise<TrainingDto> {
    const res = await fetch(`${this.baseUrl}/trainings`, {
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(dto)
    });
    if (!res.ok) throw new Error('Falha ao criar treinamento.');
    return res.json();
  }

  async updateTraining(id: string, dto: UpdateTrainingDto): Promise<TrainingDto> {
    const res = await fetch(`${this.baseUrl}/trainings/${id}`, {
      method : 'PUT',
      headers : {
        'Authorization' : `Bearer ${this.accessToken}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(dto),

    });
    if (!res.ok) throw new Error('Falha ao atualizar treinamento.');
    return res.json();
  }

  async deleteTraining(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/trainings/${id}`, {
      method : 'DELETE',
      headers : {'Authorization' : `Bearer ${this.accessToken}`}
    });
    if (!res.ok) throw new Error('Falha ao remover treinamento.');
  }
}