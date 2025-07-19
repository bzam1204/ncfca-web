'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {
  useApproveEnrollmentMutation, usePendingEnrollmentsQuery,
  useRejectEnrollmentMutation
} from '@/hooks/use-cases/use-club-management.use-case';
import {useNotify} from '@/hooks/use-notify';
import {EnrollmentRequestDto} from '@/contracts/api/enrollment.dto';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {AlertTriangle, Check, X} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {RejectEnrollmentDialog} from './reject-enrollment-dialog';

interface PendingRequestsTableProps {
  clubId: string;
  accessToken: string;
}

export function PendingRequestsTable({clubId, accessToken}: PendingRequestsTableProps) {
  const query = usePendingEnrollmentsQuery(clubId, accessToken);
  const requests = query.data || [];
  const [rejectionTarget, setRejectionTarget] = useState<EnrollmentRequestDto | null>(null);
  const {data : session} = useSession();
  const {mutate : approve, isPending : isApproving} = useApproveEnrollmentMutation();
  const {mutate : reject, isPending : isRejecting} = useRejectEnrollmentMutation();
  const notify = useNotify();

  function handleApprove(id: string) {
    if (!session?.accessToken) return;
    approve({enrollmentId : id, accessToken : session.accessToken}, {
      onSuccess : () => notify.success("Matrícula aprovada!"),
      onError : (e) => notify.error(e.message),
    });
  }

  const handleRejectSubmit = ({reason}: {reason: string}) => {
    if (!rejectionTarget || !session?.accessToken) return;
    reject({enrollmentId : rejectionTarget.id, data : {reason}, accessToken : session.accessToken}, {
      onSuccess : () => {
        notify.success("Matrícula rejeitada.");
        setRejectionTarget(null); // Fecha o modal
      },
      onError : (e) => notify.error(e.message),
    });
  };
  if (query.isLoading) return <Skeleton className="h-24 w-full" />;
  if (query.error) {
    return <Alert variant="destructive"><AlertTriangle
        className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>;
  }
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
                                      disabled={isApproving || isRejecting}><Check className="h-4 w-4 text-green-600" /></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Aprovar</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline" onClick={() => setRejectionTarget(req)}
                                      disabled={isApproving || isRejecting}><X
                                  className="h-4 w-4 text-red-600" /></Button>
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
        <RejectEnrollmentDialog
            isOpen={!!rejectionTarget}
            onClose={() => setRejectionTarget(null)}
            onSubmit={handleRejectSubmit}
            isPending={isRejecting}
        />
      </TooltipProvider>
  );
}
