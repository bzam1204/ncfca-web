'use client';

import {useState} from "react";
import {AlertTriangle, Plus, PlayCircle, Edit, Trash2, ExternalLink} from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {TrainingDto} from "@/contracts/api/training.dto";
import {useDeleteTraining} from "@/hooks/use-delete-training";

import {TrainingForm} from "./_components/training-form";
import {useGetTrainings} from "@/hooks/use-get-trainings";
import {YouTubePlayer} from "@/components/you-tube-player";

export default function AdminTrainingsPage() {
  const [selectedTraining, setSelectedTraining] = useState<TrainingDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const trainingsQuery = useGetTrainings();
  const deleteTrainingMutation = useDeleteTraining();

  const handleEdit = (training: TrainingDto) => {
    setSelectedTraining(training);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao deletar treinamento:', error);
    }
  };

  if (trainingsQuery.isLoading) {
    return (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
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

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <PlayCircle className="mr-3 h-6 w-6" />
                Gerenciar Treinamentos
              </CardTitle>
              <CardDescription>
                Gerencie os vídeos de treinamento disponíveis para os treinadores.
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Treinamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Treinamento</DialogTitle>
                </DialogHeader>
                <TrainingForm
                    onSuccess={() => setIsCreateModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {trainingsQuery.data && trainingsQuery.data.length === 0 ? (
            <Alert>
              <PlayCircle className="h-4 w-4" />
              <AlertTitle>Nenhum Treinamento Cadastrado</AlertTitle>
              <AlertDescription>
                Comece criando seu primeiro treinamento clicando no botão "Novo Treinamento".
              </AlertDescription>
            </Alert>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingsQuery.data?.map((training) => (
                  <Card key={training.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                          {training.title}
                        </span>
                        <div className="flex gap-1">
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(training)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
                                  Tem certeza que deseja excluir o treinamento "{training.title}"?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(training.id)}
                                    disabled={deleteTrainingMutation.isPending}
                                >
                                  {deleteTrainingMutation.isPending ? 'Excluindo...' : 'Excluir'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        {training.getYouTubeVideoId() ? (
                            <YouTubePlayer
                                videoId={training.getYouTubeVideoId() ?? ''}
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

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Treinamento</DialogTitle>
            </DialogHeader>
            {selectedTraining && (
                <TrainingForm
                    training={selectedTraining}
                    onSuccess={() => {
                      setIsEditModalOpen(false);
                      setSelectedTraining(null);
                    }}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}