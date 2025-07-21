// src/app/_components/request-details-dialog.tsx
'use client';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Calendar, Building, Info, AlertCircle} from "lucide-react";
import {EnrollmentRequestDto} from "@/contracts/api/enrollment.dto";
import {DependantResponseDto} from "@/contracts/api/dependant.dto";
import {ClubDto} from "@/contracts/api/club.dto";
import {enrollmentStatusTranslation, getEnrollmentStatusVariant} from "@/lib/translations";

interface RequestDetailsDialogProps {
  request: EnrollmentRequestDto | null;
  club: ClubDto | null;
  dependant: DependantResponseDto | null;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoRow = ({icon : Icon, label, value}: {
  icon: React.ElementType,
  label: string,
  value: string | undefined | null
}) => (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-muted-foreground">{value || 'Não informado'}</p>
      </div>
    </div>
);

export function RequestDetailsDialog({request, club, dependant, onOpenChange}: RequestDetailsDialogProps) {
  if (!request || !dependant) return null;

  return (
      <Dialog open={!!request} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="text-center items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${dependant.firstName}`}
                           alt={`${dependant.firstName} ${dependant.lastName}`} />
              <AvatarFallback>{dependant.firstName.charAt(0)}{dependant.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl">{dependant.firstName} {dependant.lastName}</DialogTitle>
            <div className="pt-2">
              <Badge variant={getEnrollmentStatusVariant(request.status)}>
                {enrollmentStatusTranslation[request.status]}
              </Badge>
            </div>
          </DialogHeader>

          <div className="py-4 grid gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-lg"><Info
                  className="mr-2 h-5 w-5" />Detalhes da Solicitação</h3>
              <div className="space-y-4 pl-7 border-l ml-2.5">
                <InfoRow icon={Building} label="Clube" value={club?.name} />
                <InfoRow icon={Calendar} label="Data da Solicitação"
                         value={new Date(request.requestedAt).toLocaleDateString('pt-BR')} />
                {request.resolvedAt && (
                    <InfoRow icon={Calendar} label="Data da Resposta"
                             value={new Date(request.resolvedAt).toLocaleDateString('pt-BR')} />
                )}
              </div>
            </div>

            {request.status === 'REJECTED' && request.rejectionReason && (
                <div>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Motivo da Rejeição</AlertTitle>
                    <AlertDescription>
                      <pre className='font-sans '>{request.rejectionReason}</pre>
                    </AlertDescription>
                  </Alert>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
}