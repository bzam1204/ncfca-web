import {PlayCircle} from "lucide-react";
import {Suspense} from "react";

import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

import {CreateTrainingDialog} from "@/app/(admin)/admin/dashboard/trainings/_components/create-training-dialog";
import {TrainingsList} from "@/app/(admin)/admin/dashboard/trainings/_components/trainings-list";

export default async function AdminTrainingsPage() {
  return (
      <Suspense fallback={<Fallback />}>
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
              <CreateTrainingDialog />
            </CardHeader>
          </Card>
          <TrainingsList />
        </div>
      </Suspense>)
}

function Fallback() {
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