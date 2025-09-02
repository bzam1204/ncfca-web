'use client';

import { useState } from 'react';
import { usePendingEnrollmentsQuery } from '@/hooks/use-pending-enrollments';
import { useApproveEnrollmentMutation, useRejectEnrollmentMutation } from '@/hooks/use-club-enrollment-actions';
import { useNotify } from '@/hooks/use-notify';
import { EnrollmentRequestDto, PendingEnrollmentDto } from '@/contracts/api/enrollment.dto';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check, X, MoreHorizontal, FileText, RotateCcw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PendingRequestDetailsDialog } from './pending-request-details-dialog';
import { RejectEnrollmentDialog } from '@/app/dashboard/club-management/_components/reject-enrollment-dialog';
import { QuickRejectEnrollmentDialog } from '@/app/_components/quick-reject-enrollment-dialog';

interface PendingRequestsTableProps {
  clubId: string;
}

export function PendingRequestsTable({ clubId }: PendingRequestsTableProps) {
  const { data: requests = [], isLoading, error, refetch, isRefetching } = usePendingEnrollmentsQuery(clubId);
  const [requestToReject, setRequestToReject] = useState<EnrollmentRequestDto | null>(null);
  const [rejectionTarget, setRejectionTarget] = useState<EnrollmentRequestDto | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PendingEnrollmentDto | null>(null);
  const { mutate: approve, isPending: isApproving } = useApproveEnrollmentMutation();
  const { mutate: reject, isPending: isRejecting } = useRejectEnrollmentMutation();
  const notify = useNotify();

  const handleQuickApprove = (id: string) => {
    approve(
      { clubId, enrollmentId: id },
      {
        onSuccess: () => notify.success('Matrícula aprovada!'),
        onError: (e) => notify.error(e.message),
      },
    );
  };
  const handleQuickRejectSubmit = ({ reason }: { reason: string }) => {
    if (!rejectionTarget) return;
    reject(
      { clubId, enrollmentId: rejectionTarget.id, rejectionReason: reason },
      {
        onSuccess: () => {
          notify.success('Matrícula rejeitada.');
          setRejectionTarget(null);
        },
        onError: (e) => notify.error(e.message),
      },
    );
  };

  const handleRejectSubmit = (reason: string) => {
    if (!requestToReject) return;
    reject(
      { clubId, enrollmentId: requestToReject.id, rejectionReason: reason },
      {
        onSuccess: () => {
          notify.success('Matrícula rejeitada.');
          setRequestToReject(null);
        },
        onError: (e) => notify.error(e.message),
      },
    );
  };

  if (isLoading || isRefetching) return <Skeleton className="h-24 w-full" />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit" variant="outline" size="sm" onClick={() => refetch()}>
        <RotateCcw /> Atualizar
      </Button>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <TableRow key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer ">
                  <TableCell className="font-mono text-xs">{req.dependantName}</TableCell>
                  <TableCell>{new Date(req.requestedAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" disabled={isApproving || isRejecting}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenuItem onSelect={() => setSelectedRequest(req)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Analisar Dossiê
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleQuickApprove(req.id)}>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Aprovação Rápida
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            setRejectionTarget(req);
                            e.stopPropagation();
                          }}
                          className="text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeição Rápida
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhuma solicitação pendente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PendingRequestDetailsDialog
        request={selectedRequest}
        onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}
        onSuccess={() => setSelectedRequest(null)}
        clubId={clubId}
      />
      <RejectEnrollmentDialog
        isOpen={!!requestToReject}
        onOpenChange={(isOpen) => !isOpen && setRequestToReject(null)}
        onSubmit={handleRejectSubmit}
        isPending={isRejecting}
      />
      <QuickRejectEnrollmentDialog
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleQuickRejectSubmit}
        isPending={isRejecting}
      />
    </div>
  );
}
