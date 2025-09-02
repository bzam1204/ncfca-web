'use client';

import {useState} from 'react';
import {useAdminClubRequests} from '@/hooks/use-admin-club-requests';
import {PendingEnrollmentDto} from '@/contracts/api/enrollment.dto';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, MoreHorizontal, FileText, RotateCcw} from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {PendingRequestDetailsDialog} from './pending-request-details-dialog';

interface PendingRequestsTableProps {
  clubId: string;
}

export function PendingRequestsTable({clubId}: PendingRequestsTableProps) {
  const {data : requests = [], isLoading, error, refetch, isRefetching} = useAdminClubRequests(clubId);

  const [selectedRequest, setSelectedRequest] = useState<PendingEnrollmentDto | null>(null);

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
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                              <DropdownMenuItem onSelect={() => setSelectedRequest(req)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Detalhes
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
        {selectedRequest && <PendingRequestDetailsDialog
            onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}
            onSuccess={() => setSelectedRequest(null)}
            request={selectedRequest}
            clubId={clubId}
        />}
      </div>
  );
}
