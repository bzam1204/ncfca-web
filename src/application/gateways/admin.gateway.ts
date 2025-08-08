import {Club, Family, User} from "@/domain/entities/entities";
import {EnrollmentRequest} from "@/domain/entities/enrollment-request.entity";

export interface AdminGateway {
  getAffiliations(): Promise<Family[]>;

  getEnrollments(): Promise<EnrollmentRequest[]>;

  getClubs(): Promise<Club[]>;

  getUsers(): Promise<User[]>;
}
