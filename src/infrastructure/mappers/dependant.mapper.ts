import { Dependant as Entity } from '@/domain/entities/dependant.entity';
import { DependantDto as Dto } from '@/contracts/api/dependant.dto';

export class DependantMapper {
  static mapDtoToEntity(dto: Dto): Entity {
    return new Entity({
      id: dto.id,
      sex: dto.sex,
      type: dto.type,
      email: dto.email,
      phone: dto.phone,
      familyId: dto.familyId,
      lastName: dto.lastName,
      firstName: dto.firstName,
      birthdate: new Date(dto.birthdate),
      relationship: dto.relationship,
    });
  }
}
