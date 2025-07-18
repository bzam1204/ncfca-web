// src/app/dashboard/club-management/_components/pending-requests-table.tsx
'use client';

import {useSession} from 'next-auth/react';
import {useClubManagementMutations} from '@/hooks/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {EnrollmentRequestDto} from '@/contracts/api/enrollment.dto';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle, Check, X} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

interface PendingRequestsTableProps {
  requests: EnrollmentRequestDto[];
  isLoading: boolean;
  error: Error | null;
}

export function PendingRequestsTable({requests, isLoading, error}: PendingRequestsTableProps) {
  const {data : session} = useSession();
  const {useApproveEnrollment, useRejectEnrollment} = useClubManagementMutations();
  const {mutate : approve, isPending : isApproving} = useApproveEnrollment();
  const {mutate : reject, isPending : isRejecting} = useRejectEnrollment();
  const notify = useNotify();

  const handleApprove = (id: string) => {
    if (!session?.accessToken) return;
    approve({enrollmentId : id, accessToken : session.accessToken}, {
      onSuccess : () => notify.success("Matrícula aprovada!"),
      onError : (e) => notify.error(e.message),
    });
  };

  const handleReject = (id: string) => {
    if (!session?.accessToken) return;
    const reason = prompt("Por favor, informe o motivo da rejeição:");
    if (!reason || reason.length < 10) {
      notify.error("É necessário fornecer um motivo com pelo menos 10 caracteres.");
      return;
    }
    reject({enrollmentId : id, data : {reason}, accessToken : session.accessToken}, {
      onSuccess : () => notify.success("Matrícula rejeitada."),
      onError : (e) => notify.error(e.message),
    });
  };

  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (error) return <Alert variant="destructive"><AlertTriangle
      className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
      <TooltipProvider>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dependente (ID)</TableHead>
                <TableHead>Data da Solicitação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                  requests.map(req => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-xs">{req.dependantId}</TableCell>
                        <TableCell>{new Date(req.requestedAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline" onClick={() => handleApprove(req.id)}
                                      disabled={isApproving || isRejecting}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Aprovar</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline" onClick={() => handleReject(req.id)}
                                      disabled={isApproving || isRejecting}>
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Rejeitar</p></TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow><TableCell colSpan={3}
                                       className="h-24 text-center">Nenhuma solicitação pendente.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
  );
}
