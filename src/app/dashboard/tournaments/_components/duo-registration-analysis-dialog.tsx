'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Calendar, Building2, Users, Trophy, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

import { SearchMyRegistrationItemView } from '@/contracts/api/registration.dto';
import { useAcceptDuoRegistration } from '@/hooks/registrations/use-accept-duo-registration';
import { useRejectDuoRegistration } from '@/hooks/registrations/use-reject-duo-registration';

interface DuoRegistrationAnalysisDialogProps {
  registration: SearchMyRegistrationItemView | null;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-3 text-sm">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="font-semibold">{label}:</span>
    <span className="text-muted-foreground">{value || 'Não informado'}</span>
  </div>
);

export function DuoRegistrationAnalysisDialog({ registration, onOpenChange }: DuoRegistrationAnalysisDialogProps) {
  const { mutate: accept, isPending: isAccepting } = useAcceptDuoRegistration();
  const { mutate: reject, isPending: isRejecting } = useRejectDuoRegistration();
  
  const isProcessing = isAccepting || isRejecting;

  if (!registration) return null;

  const handleAccept = () => {
    accept(registration.registrationId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleReject = () => {
    reject(registration.registrationId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={!!registration} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-2xl">Convite para Dupla</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Solicitado em {new Date(registration.requestedAt).toLocaleDateString('pt-BR')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 grid gap-6">
          {/* Tournament Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Trophy className="mr-2 h-4 w-4" /> Informações do Torneio
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={Trophy} label="Nome do Torneio" value={registration.tournamentName} />
              <InfoField icon={Users} label="Tipo" value="Dupla" />
              <InfoField icon={Calendar} label="Data da Solicitação" value={new Date(registration.requestedAt).toLocaleDateString('pt-BR')} />
            </div>
          </div>

          {/* Partner Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="mr-2 h-4 w-4" /> Dados do Solicitante
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={User} label="Nome" value={registration.competitorName} />
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Building2 className="mr-2 h-4 w-4" /> Detalhes da Solicitação
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <div className="text-sm text-muted-foreground">
                Você foi convidado(a) por <strong>{registration.competitorName}</strong> para formar uma dupla 
                no torneio &ldquo;<strong>{registration.tournamentName}</strong>&rdquo;. 
                <br /><br />
                Aceitar este convite confirmará sua participação neste torneio como dupla.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={handleReject} 
            disabled={isProcessing} 
            className="flex-1"
          >
            {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <XCircle className="mr-2 h-4 w-4" />
            Recusar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                disabled={isProcessing}
              >
                {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CheckCircle className="mr-2 h-4 w-4" />
                Aceitar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Aceitar Convite para Dupla?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação confirmará sua participação no torneio &ldquo;{registration.tournamentName}&rdquo; 
                  como parceiro(a) de {registration.competitorName}. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleAccept}>Confirmar Aceite</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}