import {QueryService} from "@/domain/services/query.service";

import {GetMyEnrollmentRequests} from "@/application/use-cases/enrollments/get-my-enrollment-requests.use-case";
import {ClubRequestGateway} from "@/application/gateways/club-request.gateway";
import {RequestEnrollment} from "@/application/use-cases/enrollments/request-enrollment.use-case";
import {EnrollmentGateway} from "@/application/gateways/enrollment/enrollment.gateway";
import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {CreateTraining} from "@/application/use-cases/trainings/create-training.use-case";
import {UpdateTraining} from "@/application/use-cases/trainings/update-training.use-case";
import {DeleteTraining} from "@/application/use-cases/trainings/delete-training.use-case";
import {GetDependants} from "@/application/use-cases/dependants/get.dependants";
import {AdminGateway} from "@/application/gateways/admin.gateway";
import {GetTrainings} from "@/application/use-cases/trainings/get-trainings.use-case";
import {ClubGateway} from "@/application/gateways/club.gateway";
import {SearchClubs} from "@/application/use-cases/clubs/search-clubs.use-case";

import {ClubRequestGatewayApi} from "@/infraestructure/gateways/club-request.gateway.api";
import {EnrollmentGatewayApi} from "@/infraestructure/gateways/enrollment.gateway.api";
import {TrainingGatewayApi} from "@/infraestructure/gateways/training.gateway.api";
import {DependantQueryApi} from "@/infraestructure/queries/dependant.query.api";
import {QueryServiceApi} from "@/infraestructure/services/query.service.api";
import {AdminGatewayApi} from "@/infraestructure/gateways/admin.gateway.api";
import {ClubGatewayApi} from "@/infraestructure/gateways/club.gateway.api";
import {ClubQueryApi} from "@/infraestructure/queries/club.query.api";
import {FamilyGateway} from "@/application/gateways/family.gateway";
import {FamilyGatewayApi} from "@/infraestructure/gateways/family.gateway.api";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

function queryService(accessToken: string): QueryService {
  const clubQuery = new ClubQueryApi(apiUrl, accessToken);
  const dependantQuery = new DependantQueryApi(apiUrl, accessToken);
  return new QueryServiceApi(clubQuery, dependantQuery);
}

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

export const Inject = {
  QueryService : queryService,
  ClubRequestGateway : clubRequestGateway,
  EnrollmentGateway : enrollmentGateway,
  TrainingGateway : trainingGateway,
  FamilyGateway : familyGateway,
  AdminGateway : adminGateway,
  ClubGateway : clubGateway,
}