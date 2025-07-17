// src/lib/translations.ts

import {Sex} from "@/domain/enums/sex.enum";
import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {VariantProps} from "class-variance-authority";
import {type badgeVariants} from "@/components/ui/badge";

export const sexTranslation: Record<Sex, string> = {
  [Sex.MALE] : "Masculino",
  [Sex.FEMALE] : "Feminino",
};

export const dependantRelationshipTranslation: Record<DependantRelationship, string> = {
  [DependantRelationship.SON] : "Filho",
  [DependantRelationship.DAUGHTER] : "Filha",
  [DependantRelationship.HUSBAND] : "Marido",
  [DependantRelationship.WIFE] : "Esposa",
  [DependantRelationship.CHILD] : "Criança",
  [DependantRelationship.OTHER] : "Outro",
};

export const familyStatusTranslation: Record<FamilyStatus, string> = {
  [FamilyStatus.AFFILIATED] : "Afiliado",
  [FamilyStatus.NOT_AFFILIATED] : "Não Afiliado",
  [FamilyStatus.PENDING_PAYMENT] : "Pagamento Pendente",
  [FamilyStatus.EXPIRED] : "Expirado",
};

// NOVO: Helper para mapear o status a uma variante de cor do Badge.
// Isso permite que a cor do status seja consistente em toda a aplicação.
export const getFamilyStatusVariant = (status: FamilyStatus): VariantProps<typeof badgeVariants>["variant"] => {
  switch (status) {
    case FamilyStatus.AFFILIATED:
      return "default"; // Assumindo que 'default' é verde/positivo. Adicione variantes se necessário.
    case FamilyStatus.EXPIRED:
      return "destructive";
    case FamilyStatus.PENDING_PAYMENT:
      return "secondary"; // Assumindo que 'secondary' é amarelo/laranja.
    default:
      return "outline";
  }
};