import { FamilyStatus } from '@/domain/enums/family-status.enum';
import { Dependant } from '@/domain/entities/dependant.entity';

export interface FamilyResponseDto {
  id: string;
  holderId: string;
  status: FamilyStatus;
  affiliatedAt: string | null; // Datas em JSON são strings no formato ISO
  affiliationExpiresAt: string | null;
  dependants: Dependant[];
}
