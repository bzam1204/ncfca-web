import { FamilyStatus } from '@/domain/enums/family-status.enum';
import { Dependant } from '@/domain/entities/dependant.entity';
import { UserDto } from '@/contracts/api/user.dto';

export interface AffiliationDto {
  id: string;
  holderId: string;
  status: FamilyStatus;
  affiliatedAt: string | null;
  affiliationExpiresAt: string | null;
  holder: UserDto;
  dependants: Dependant[];
}
