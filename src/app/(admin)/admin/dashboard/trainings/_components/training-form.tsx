'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {CreateTrainingDto, TrainingDto, UpdateTrainingDto} from "@/contracts/api/training.dto";
import {useCreateTraining} from "@/hooks/use-create-training";
import {useUpdateTraining} from "@/hooks/use-update-training";

export function TrainingForm({training, onSuccess}: TrainingFormProps) {
  const isEditing = !!training;
  const createTrainingMutation = useCreateTraining();
  const updateTrainingMutation = useUpdateTraining();

  const form = useForm<TrainingFormData>({
    resolver : zodResolver(trainingSchema),
    defaultValues : {
      title : training?.title || "",
      description : training?.description || "",
      youtubeUrl : training?.youtubeUrl || "",
    },
  });

  const onSubmit = async (data: TrainingFormData) => {
    try {
      if (isEditing && training) {
        const updateDto: UpdateTrainingDto = data;
        await updateTrainingMutation.mutateAsync({id : training.id, dto : updateDto});
      } else {
        const createDto: CreateTrainingDto = data;
        await createTrainingMutation.mutateAsync(createDto);
      }
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
    }
  };

  const isLoading = createTrainingMutation.isPending || updateTrainingMutation.isPending;

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do treinamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                          placeholder="Digite uma descrição para o treinamento"
                          className="min-h-[100px] overflow-y-auto max-h-[300px]"
                          {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="youtubeUrl"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>URL do YouTube</FormLabel>
                    <FormControl>
                      <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                  ? (isEditing ? 'Atualizando...' : 'Criando...')
                  : (isEditing ? 'Atualizar Treinamento' : 'Criar Treinamento')
              }
            </Button>
          </div>
        </form>
      </Form>
  );
}

const trainingSchema = z.object({
  title : z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  description : z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  youtubeUrl : z.string().url("URL deve ser válida").refine(
      (url) => url.includes('youtube.com') || url.includes('youtu.be'),
      "URL deve ser do YouTube"
  ),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  training?: TrainingDto;
  onSuccess: () => void;
}