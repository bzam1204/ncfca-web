import { Sex } from '@/domain/enums/sex.enum';
import { DependantType } from '@/domain/enums/dependant-type.enum';
import { DependantRelationship } from '@/domain/enums/dependant-relationship.enum';

export class Dependant {
  readonly id: string;
  readonly sex: Sex;
  readonly type: DependantType;
  readonly email: string;
  readonly phone: string | null;
  readonly familyId: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly birthdate: Date;
  readonly relationship: DependantRelationship;

  constructor(props: CreateDependantProps) {
    this.id = props.id;
    this.sex = props.sex;
    this.type = props.type;
    this.email = props.email;
    this.phone = props.phone;
    this.familyId = props.familyId;
    this.lastName = props.lastName;
    this.firstName = props.firstName;
    this.birthdate = props.birthdate;
    this.relationship = props.relationship;
  }

  public getAge(): number {
    const birthDate = new Date(this.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

interface CreateDependantProps {
  id: string;
  sex: Sex;
  type: DependantType;
  email: string;
  phone: string | null;
  familyId: string;
  lastName: string;
  firstName: string;
  birthdate: Date;
  relationship: DependantRelationship;
}
