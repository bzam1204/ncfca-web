// src/infraestructure/translations.ts

import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/components/ui/badge';
import { DependantRelationship } from '@/domain/enums/dependant-relationship.enum';
import { Sex } from '@/domain/enums/sex.enum';
import { FamilyStatus } from '@/domain/enums/family-status.enum';
import { EnrollmentStatus } from '@/domain/enums/enrollment-status.enum';
import { RegistrationStatus } from '@/contracts/api/registration.dto';
import { DependantType } from '@/domain/enums/dependant-type.enum';

export const sexTranslation: Record<Sex, string> = {
  [Sex.MALE]: 'Masculino',
  [Sex.FEMALE]: 'Feminino',
};

export const dependantTypeTranslation: Record<DependantType, string> = {
  [DependantType.STUDENT]: 'Estudante',
  [DependantType.ALUMNI]: 'Ex-aluno',
  [DependantType.PARENT]: 'Pai/Mãe',
};

export const dependantRelationshipTranslation: Record<DependantRelationship, string> = {
  [DependantRelationship.SON]: 'Filho',
  [DependantRelationship.DAUGHTER]: 'Filha',
  [DependantRelationship.HUSBAND]: 'Marido',
  [DependantRelationship.WIFE]: 'Esposa',
  [DependantRelationship.CHILD]: 'Criança',
  [DependantRelationship.OTHER]: 'Outro',
};

export const familyStatusTranslation: Record<FamilyStatus, string> = {
  [FamilyStatus.AFFILIATED]: 'Afiliado',
  [FamilyStatus.NOT_AFFILIATED]: 'Não Afiliado',
  [FamilyStatus.PENDING_PAYMENT]: 'Pagamento Pendente',
  [FamilyStatus.EXPIRED]: 'Expirado',
};

export const getFamilyStatusVariant = (status: FamilyStatus): VariantProps<typeof badgeVariants>['variant'] => {
  switch (status) {
    case FamilyStatus.AFFILIATED:
      return 'default';
    case FamilyStatus.EXPIRED:
      return 'destructive';
    case FamilyStatus.PENDING_PAYMENT:
      return 'outline';
    default:
      return 'secondary';
  }
};

// ADICIONADO: Tradução e variantes para o status da matrícula.
export const enrollmentStatusTranslation: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.PENDING]: 'Pendente',
  [EnrollmentStatus.APPROVED]: 'Aprovada',
  [EnrollmentStatus.REJECTED]: 'Rejeitada',
};

export const getEnrollmentStatusVariant = (status: EnrollmentStatus): VariantProps<typeof badgeVariants>['variant'] => {
  switch (status) {
    case EnrollmentStatus.APPROVED:
      return 'default';
    case EnrollmentStatus.REJECTED:
      return 'destructive';
    case EnrollmentStatus.PENDING:
    default:
      return 'secondary';
  }
};

// Torneios: Tradução e variantes para o status da inscrição em torneios.
export const registrationStatusTranslation: Record<RegistrationStatus, string> = {
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  PENDING_APPROVAL: 'Aguardando Aprovação',
  REJECTED: 'Rejeitada',
};

export const getRegistrationStatusVariant = (
  status: RegistrationStatus,
): VariantProps<typeof badgeVariants>['variant'] => {
  switch (status) {
    case 'CONFIRMED':
      return 'default';
    case 'REJECTED':
    case 'CANCELLED':
      return 'destructive';
    case 'PENDING_APPROVAL':
    default:
      return 'secondary';
  }
};
