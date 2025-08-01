'use client';

import { PlayCircle, Trash2} from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {YouTubePlayer} from "@/components/you-tube-player";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import {useDeleteTraining} from "@/hooks/use-delete-training";
import {useGetTrainings} from "@/hooks/use-get-trainings";
import {EditTrainingDialog} from "@/app/(admin)/admin/dashboard/trainings/_components/edit-training-dialog";

export function TrainingsList() {
  const trainingsQuery = useGetTrainings();
  const deleteTrainingMutation = useDeleteTraining();
  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao deletar treinamento:', error);
    }
  };
  if (trainingsQuery.isLoading) return <Fallback />;
  return (<>
        {trainingsQuery.trainings.length === 0 ? (
            <Alert>
              <PlayCircle className="h-4 w-4" />
              <AlertTitle>Nenhum Treinamento Cadastrado</AlertTitle>
              <AlertDescription>
                Comece criando seu primeiro treinamento clicando no botão `&quot;`Novo Treinamento`&quot;`.
              </AlertDescription>
            </Alert>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {trainingsQuery.trainings.map((training) => (
                  <Card key={training.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                          {training.title}
                        </span>
                        <div className="flex gap-1">
                          <EditTrainingDialog training={training} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o treinamento `&quot;`{training.title}`&quot;`?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteTrainingMutation.mutate(training.id)}
                                    disabled={deleteTrainingMutation.isPending}
                                >
                                  {deleteTrainingMutation.isPending ? 'Excluindo...' : 'Excluir'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <CardDescription>{training.description.substring(0, 150)}...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                      {training.getYouTubeVideoId() ? (
                          <YouTubePlayer
                              videoId={training.getYouTubeVideoId()!}
                              title={training.title}
                              className="rounded-lg"
                          />
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
              ))}
            </div>
        )}

      </>
  )
}

function Fallback() {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
    ))}
  </div>
}