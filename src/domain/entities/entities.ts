import {Sex} from "@/domain/enums/sex.enum";
import {UserRoles} from "@/domain/enums/user.roles";
import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {PaymentStatus} from "@/domain/enums/payment-status.enum";
import {PaymentMethod} from "@/domain/enums/payment-method.enum";
import {MembershipStatus} from "@/domain/enums/membership-status.enum";
import {EnrollmentStatus} from "@/domain/enums/enrollment-status.enum";
import {DependantRelationship} from "@/domain/enums/dependant-relationship.enum";
import {TransactionContextType} from "@/domain/enums/transaction-context-type.enum";
import {DependantType} from "@/domain/enums/dependant-type.enum";
import {Dependant} from "@/domain/entities/dependant.entity";

export interface Address {
  city: string;
  state: string;
  street: string;
  number: string;
  zipCode: string;
  district: string;
  complement?: string;
}

export interface User {
  id: string;
  rg: string;
  cpf: string;
  email: string;
  phone: string;
  roles: UserRoles[];
  address: Address;
  lastName: string;
  firstName: string;
}

export interface Family {
  id: string;
  status: FamilyStatus;
  holderId: string;
  dependants: Dependant[];
  affiliatedAt: Date | null;
  affiliationExpiresAt: Date | null;
}

export interface Club {
  id: string;
  name: string;
  city: string;
  state: string;
  status: boolean;
  ownerId: string;
}

export interface ClubMembership {
  id: string;
  clubId: string;
  memberId: string;
  familyId: string;
  status: MembershipStatus;
}

export interface EnrollmentRequest {
  id: string;
  clubId: string;
  memberId: string;
  familyId: string;
  status: EnrollmentStatus;
  resolvedAt: Date | null;
  requestedAt: Date;
  rejectionReason: string | null;
}

export interface Transaction {
  id: string;
  status: PaymentStatus;
  userId: string;
  gateway: string;
  familyId: string;
  createdAt: Date;
  amountCents: number;
  contextType: TransactionContextType;
  paymentMethod: PaymentMethod;
  gatewayPayload: Record<string, any> | null;
  gatewayTransactionId: string;
}
