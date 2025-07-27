'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AffiliationDto } from "@/contracts/api/affiliation.dto";
import { familyStatusTranslation, getFamilyStatusVariant } from "@/lib/translations";
import { DependantRelationshipTranslation } from "@/domain/enums/dependant-relationship.enum";

interface AffiliationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  affiliation: AffiliationDto | null;
}

const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value || 'Não informado'}</p>
    </div>
);

const calculateAge = (birthdate: string) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export function AffiliationDetailsDialog({ isOpen, onClose, affiliation }: AffiliationDetailsDialogProps) {
  if (!affiliation) return null;

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Família de {affiliation.holder.firstName} {affiliation.holder.lastName}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos da afiliação, do responsável e dos dependentes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <InfoField label="Status da Afiliação" value={<Badge variant={getFamilyStatusVariant(affiliation.status)}>{familyStatusTranslation[affiliation.status]}</Badge>} />
            <InfoField label="Data da Afiliação" value={formatDate(affiliation.affiliatedAt)} />
            <InfoField label="Data de Expiração" value={formatDate(affiliation.affiliationExpiresAt)} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
            <div>
              <h3 className="font-bold text-lg mb-4">Dados do Responsável</h3>
              <div className="space-y-3">
                <InfoField label="Email" value={affiliation.holder.email} />
                <InfoField label="Telefone" value={affiliation.holder.phone} />
                <InfoField label="CPF" value={affiliation.holder.cpf} />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Endereço</h3>
              <div className="space-y-3">
                <InfoField label="Logradouro" value={`${affiliation.holder.address.street}, ${affiliation.holder.address.number}`} />
                <InfoField label="Bairro" value={affiliation.holder.address.district} />
                <InfoField label="Cidade/UF" value={`${affiliation.holder.address.city} / ${affiliation.holder.address.state}`} />
                <InfoField label="CEP" value={affiliation.holder.address.zipCode} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="py-4">
            <h3 className="font-bold text-lg mb-4">Dependentes ({affiliation.dependants.length})</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Parentesco</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliation.dependants.map(dep => (
                      <TableRow key={dep.id}>
                        <TableCell>{dep.firstName} {dep.lastName}</TableCell>
                        <TableCell>{calculateAge(dep.birthdate)} anos</TableCell>
                        <TableCell>{DependantRelationshipTranslation[dep.relationship]}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}
