'use client'

import {useState} from "react";
import {AlertTriangle, Eye} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

import {MyEnrollmentRequestsDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";
import {useGetMyEnrollmentRequests} from "@/hooks/use-get-my-enrollment-requests";

import {enrollmentStatusTranslation, getEnrollmentStatusVariant} from "@/infraestructure/translations";

import {RequestDetailsDialog} from "@/app/_components/request-details-dialog";

export function MyEnrollmentRequestsTable() {
  const [selectedRequest, setSelectedRequest] = useState<MyEnrollmentRequestsDto | null>(null);
  const {isLoading, error, ...query} = useGetMyEnrollmentRequests();
  const requests = query.data ?? [];
  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }
  if (error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro ao Carregar Solicitações</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>;
  }
  return (
      <>
        <div className="border rounded-md max-h-[300px] overflow-y-auto scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clube</TableHead>
                <TableHead>Dependente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                  requests.map(req => (
                      <TableRow key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer">
                        <TableCell className="font-medium">{req.clubName || '...'}</TableCell>
                        <TableCell>{req.dependantName || '...'}</TableCell>
                        <TableCell>
                          <Badge variant={getEnrollmentStatusVariant(req.status)}>
                            {enrollmentStatusTranslation[req.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Você ainda não fez nenhuma solicitação de matrícula.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <RequestDetailsDialog
            request={selectedRequest}
            onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}
        />
      </>
  );
}
