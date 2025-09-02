'use client';

import { AlertTriangle, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTrainings } from '@/hooks/use-get-trainings';
import { YouTubePlayer } from '@/components/you-tube-player';

export function TrainingsTab() {
  const trainingsQuery = useGetTrainings();

  if (trainingsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (trainingsQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Treinamentos</AlertTitle>
        <AlertDescription>{trainingsQuery.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!trainingsQuery.data || trainingsQuery.data.length === 0) {
    return (
      <Alert>
        <PlayCircle className="h-4 w-4" />
        <AlertTitle>Nenhum Treinamento Disponível</AlertTitle>
        <AlertDescription>Não há treinamentos disponíveis no momento. Volte mais tarde para verificar novos conteúdos.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg gap-6">
      {trainingsQuery.data.map((training) => {
        return (
          <Card key={training.id} className="flex flex-col p-4 justify-between">
            <CardHeader className="pb-1 p-0">
              <CardTitle className="flex items-center text-lg">
                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                {training.title}
              </CardTitle>
              <CardDescription className="text-sm">{training.description.substring(0, 150)}...</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-end p-0">
              {training.getYouTubeVideoId() ? (
                <YouTubePlayer videoId={training.getYouTubeVideoId() ?? ''} title={training.title} />
              ) : (
                <div className="flex items-center justify-center h-48 bg-muted rounded-b-lg">
                  <div className="text-center text-muted-foreground">
                    <PlayCircle className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Vídeo não disponível</p>
                    <p className="text-xs">URL inválida</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
