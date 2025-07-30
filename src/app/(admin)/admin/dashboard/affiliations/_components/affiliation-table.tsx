// src/app/(admin)/admin/dashboard/affiliations/_components/affiliation-table.tsx
'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAdminListAffiliations } from "@/application/use-cases/use-admin-management.use-case";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { familyStatusTranslation, getFamilyStatusVariant } from "@/infraestructure/translations";
import { AffiliationDto } from "@/contracts/api/affiliation.dto";
import {
  AffiliationDetailsDialog
} from "@/app/(admin)/admin/dashboard/affiliations/_components/affiliations-details-dialog";

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function AffiliationsTable({ initialData }: { initialData: AffiliationDto[] }) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  const [selectedAffiliation, setSelectedAffiliation] = useState<AffiliationDto | null>(null);
  const { data: affiliations = initialData } = useAdminListAffiliations(accessToken);

  return (
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expira em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliations.map(affiliation => (
                  <TableRow key={affiliation.id} onClick={() => setSelectedAffiliation(affiliation)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {affiliation.holder.firstName} {affiliation.holder.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getFamilyStatusVariant(affiliation.status)}>
                        {familyStatusTranslation[affiliation.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(affiliation.affiliationExpiresAt)}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AffiliationDetailsDialog
            isOpen={!!selectedAffiliation}
            onClose={() => setSelectedAffiliation(null)}
            affiliation={selectedAffiliation}
        />
      </>
  );
}