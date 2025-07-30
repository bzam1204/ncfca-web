export interface TrainingDto {
  id: string;
  title: string;
  createdAt: string;
  youtubeUrl: string;
  description: string;
}

export interface CreateTrainingDto {
  description: string;
  youtubeUrl: string;
  title: string;
}

export interface UpdateTrainingDto {
  description?: string;
  youtubeUrl?: string;
  title?: string;
}
