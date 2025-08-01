'use client';

import {useState} from "react";
import {Edit} from "lucide-react";

import {Training} from "@/domain/entities/training.entity";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

import {TrainingForm} from "@/app/(admin)/admin/dashboard/trainings/_components/training-form";

export function EditTrainingDialog(props: EditTrainingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" >
        <Edit className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar Treinamento</DialogTitle>
      </DialogHeader>
      <TrainingForm training={props.training} onSuccess={() => setIsOpen(false)} />
    </DialogContent>
  </Dialog>
}

interface EditTrainingDialogProps {
  training: Training;
}