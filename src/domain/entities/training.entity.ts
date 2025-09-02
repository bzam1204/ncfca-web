export class Training {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly youtubeUrl: string;
  readonly createdAt: string;

  constructor(props: CreateTrainingProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.youtubeUrl = props.youtubeUrl;
    this.createdAt = props.createdAt;
  }

  public getYouTubeVideoId(): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|googleusercontent\.com\/youtube\.com\/)([a-zA-Z0-9_-]{11}|\d+)/;
    const match = this.youtubeUrl.match(regex);
    return match ? match[1] : null;
  }
}

interface CreateTrainingProps {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  createdAt: string;
}
