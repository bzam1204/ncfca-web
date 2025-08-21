import {ClubRequestGateway} from "@/application/gateways/club-request.gateway";
import {EnrollmentGateway} from "@/application/gateways/enrollment/enrollment.gateway";
import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {AdminGateway} from "@/application/gateways/admin.gateway";
import {ClubGateway} from "@/application/gateways/club.gateway";
import {FamilyGateway} from "@/application/gateways/family.gateway";
import {AuthGateway} from "@/application/gateways/auth.gateway";

import {ClubRequestGatewayApi} from "@/infraestructure/gateways/club-request.gateway.api";
import {EnrollmentGatewayApi} from "@/infraestructure/gateways/enrollment.gateway.api";
import {TrainingGatewayApi} from "@/infraestructure/gateways/training.gateway.api";
import {AdminGatewayApi} from "@/infraestructure/gateways/admin.gateway.api";
import {ClubGatewayApi} from "@/infraestructure/gateways/club.gateway.api";
import {FamilyGatewayApi} from "@/infraestructure/gateways/family.gateway.api";
import {AuthGatewayApi} from "@/infraestructure/gateways/auth.gateway.api";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';


function enrollmentGateway(accessToken: string): EnrollmentGateway {
  return new EnrollmentGatewayApi(apiUrl, accessToken);
}

function adminGateway(accessToken: string): AdminGateway {
  return new AdminGatewayApi(apiUrl, accessToken);
}

function trainingGateway(accessToken: string): TrainingGateway {
  return new TrainingGatewayApi(apiUrl, accessToken);
}

function clubRequestGateway(accessToken: string): ClubRequestGateway {
  return new ClubRequestGatewayApi(apiUrl, accessToken);
}

function clubGateway(accessToken: string): ClubGateway {
  return new ClubGatewayApi(apiUrl, accessToken);
}

function familyGateway(accessToken: string): FamilyGateway {
  return new FamilyGatewayApi(apiUrl, accessToken);
}

function authGateway(): AuthGateway {
  return new AuthGatewayApi(apiUrl);
}


export const Inject = {
  ClubRequestGateway : clubRequestGateway,
  EnrollmentGateway : enrollmentGateway,
  TrainingGateway : trainingGateway,
  FamilyGateway : familyGateway,
  AdminGateway : adminGateway,
  ClubGateway : clubGateway,
  AuthGateway : authGateway,
}