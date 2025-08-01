'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useDependantDetailsQuery} from '@/application/use-cases/use-dependant-details.use-case';
import {
  useApproveEnrollmentMutation,
  useRejectEnrollmentMutation
} from '@/application/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {EnrollmentRequestDto} from '@/contracts/api/enrollment.dto';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Textarea} from '@/components/ui/textarea';
import {User, Phone, Mail, Shield, Check, X, AlertCircle, Loader2} from "lucide-react";

const rejectionSchema = z.object({
  reason : z.string().min(10, {message : 'O motivo deve ter no mínimo 10 caracteres.'}),
});
type RejectionInput = z.infer<typeof rejectionSchema>;

interface PendingRequestDetailsDialogProps {
  request: EnrollmentRequestDto | null;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const InfoField = ({icon : Icon, label, value}: {
  icon: React.ElementType,
  label: string,
  value: string | undefined | null
}) => (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="font-semibold">{label}:</span>
      <span className="text-muted-foreground truncate">{value || 'Não informado'}</span>
    </div>
);

export function PendingRequestDetailsDialog({request, onOpenChange, onSuccess}: PendingRequestDetailsDialogProps) {
  const [isRejectionMode, setRejectionMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm<RejectionInput>({resolver : zodResolver(rejectionSchema)});

  const {data : session} = useSession();
  const accessToken = session?.accessToken ?? '';
  const {data : dependant, isLoading, error} = useDependantDetailsQuery(request?.dependantId ?? null, accessToken);

  const notify = useNotify();
  const {mutate : approve, isPending : isApproving} = useApproveEnrollmentMutation();
  const {mutate : reject, isPending : isRejecting} = useRejectEnrollmentMutation();

  const handleApprove = () => {
    if (!request) return;
    approve({enrollmentId : request.id, accessToken}, {
      onSuccess : () => {
        notify.success("Matrícula aprovada com sucesso.");
        onSuccess();
      },
      onError : (e) => notify.error(e.message),
    });
  };

  const handleRejectSubmit = (data: RejectionInput) => {
    if (!request) return;
    reject({enrollmentId : request.id, data : {reason : data.reason}, accessToken}, {
      onSuccess : () => {
        notify.success("Matrícula rejeitada.");
        setRejectionMode(false);
        onSuccess();
      },
      onError : (e) => notify.error(e.message),
    });
  };

  return (
      <Dialog open={!!request} onOpenChange={onOpenChange}>
        <DialogTitle className="hidden">
          Detalhes da Solicitação de Matrícula

        </DialogTitle>
        <DialogContent className="sm:max-w-[480px]">
          {isLoading && <Skeleton className="h-[400px] w-full" />}
          {error && <Alert variant="destructive"><AlertCircle
              className="h-4 w-4" /><AlertTitle>Erro ao Carregar Dossiê</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>}

          {dependant && (
              <>
                <DialogHeader className="text-center items-center">
                  <DialogTitle className="text-2xl">{dependant.firstName} {dependant.lastName}</DialogTitle>
                  <DialogDescription>
                    Solicitado em: {request ? new Date(request.requestedAt).toLocaleDateString('pt-BR') : ''}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center"><Shield
                        className="mr-2 h-4 w-4" /> Responsável Familiar</h3>
                    <div className="space-y-2 pl-6 border-l ml-2">
                      <InfoField icon={User} label="Nome"
                                 value={`${dependant.holder.firstName} ${dependant.holder.lastName}`} />
                      <InfoField icon={Mail} label="Email" value={dependant.holder.email} />
                      <InfoField icon={Phone} label="Telefone" value={dependant.holder.phone} />
                    </div>
                  </div>

                  {isRejectionMode && (
                      <form id="details-rejection-form" onSubmit={handleSubmit(handleRejectSubmit)}
                            className="space-y-2">
                        <label htmlFor="reason" className="font-semibold">Motivo da Rejeição</label>
                        <Textarea id="reason" {...register('reason')} placeholder="Detalhe o motivo da rejeição..." />
                        {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                      </form>
                  )}
                </div>

                <DialogFooter>
                  {isRejectionMode ? (
                      <>
                        <Button variant="ghost" onClick={() => setRejectionMode(false)}>Cancelar</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isRejecting}>
                              Confirmar Rejeição
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A família será notificada da rejeição.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction type="submit" form="details-rejection-form" disabled={isRejecting}>
                                {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sim, Rejeitar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                  ) : (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Button variant="destructive" onClick={() => setRejectionMode(true)} disabled={isApproving}>
                          <X className="mr-2 h-4 w-4" />
                          Rejeitar
                        </Button>
                        <Button onClick={handleApprove} disabled={isApproving}>
                          {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                              <Check className="mr-2 h-4 w-4" />}
                          Aprovar
                        </Button>
                      </div>
                  )}
                </DialogFooter>
              </>
          )}
        </DialogContent>
      </Dialog>
  );
}
