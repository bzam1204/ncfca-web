import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { ClubRequestActions } from "./club-request-actions";

interface PendingClubRequestsTableProps {
  requests: ClubRequestStatusDto[];
}

export function PendingClubRequestsTable({ requests }: PendingClubRequestsTableProps) {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            Aprove ou rejeite as solicitações para criação de novos clubes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Clube Proposto</TableHead>
                  <TableHead>Localidade</TableHead>
                  <TableHead>Data da Solicitação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                    requests.map(req => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.clubName}</TableCell>
                          {/* Supondo que o DTO tenha city e state, ajuste conforme o contrato real */}
                          <TableCell>{(req as any).address?.city || 'N/A'}, {(req as any).address?.state || 'N/A'}</TableCell>
                          <TableCell>{new Date(req.requestedAt).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <ClubRequestActions requestId={req.id} />
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">Nenhuma solicitação pendente no momento.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
