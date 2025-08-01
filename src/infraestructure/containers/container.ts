import {QueryService} from "@/domain/services/query.service";

import {GetMyEnrollmentRequests} from "@/application/use-cases/enrollments/get-my-enrollment-requests.use-case";
import {RequestEnrollment} from "@/application/use-cases/enrollments/request-enrollment.use-case";
import {EnrollmentGateway} from "@/application/gateways/enrollment/enrollment.gateway";
import {TrainingGateway} from "@/application/gateways/training/training.gateway";
import {CreateTraining} from "@/application/use-cases/trainings/create-training.use-case";
import {UpdateTraining} from "@/application/use-cases/trainings/update-training.use-case";
import {DeleteTraining} from "@/application/use-cases/trainings/delete-training.use-case";
import {GetDependants} from "@/application/use-cases/dependants/get.dependants";
import {GetTrainings} from "@/application/use-cases/trainings/get-trainings.use-case";
import {SearchClubs} from "@/application/use-cases/clubs/search-clubs.use-case";

import {EnrollmentGatewayApi} from "@/infraestructure/gateways/enrollment.gateway.api";
import {TrainingGatewayApi} from "@/infraestructure/gateways/training.gateway.api";
import {DependantQueryApi} from "@/infraestructure/queries/dependant.query.api";
import {QueryServiceApi} from "@/infraestructure/services/query.service.api";
import {ClubQueryApi} from "@/infraestructure/queries/club.query.api";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

function queryService(accessToken: string): QueryService {
  const clubQuery = new ClubQueryApi(apiUrl, accessToken);
  const dependantQuery = new DependantQueryApi(apiUrl, accessToken);
  return new QueryServiceApi(clubQuery, dependantQuery);
}

function enrollmentGateway(accessToken: string): EnrollmentGateway {
  return new EnrollmentGatewayApi(apiUrl, accessToken);
}

function trainingGateway(accessToken: string): TrainingGateway {
  return new TrainingGatewayApi(apiUrl, accessToken);
}

function searchClubs(accessToken: string): SearchClubs {
  return new SearchClubs(queryService(accessToken))
}

function getDependants(accessToken: string): GetDependants {
  return new GetDependants(queryService(accessToken));
}

function requestEnrollment(accessToken: string): RequestEnrollment {
  return new RequestEnrollment(enrollmentGateway(accessToken));
}

function getMyEnrollmentRequests(accessToken: string): GetMyEnrollmentRequests {
  return new GetMyEnrollmentRequests(enrollmentGateway(accessToken));
}

function getTrainings(accessToken: string): GetTrainings {
  return new GetTrainings(trainingGateway(accessToken));
}

function createTraining(accessToken: string): CreateTraining {
  return new CreateTraining(trainingGateway(accessToken));
}

function updateTraining(accessToken: string): UpdateTraining {
  return new UpdateTraining(trainingGateway(accessToken));
}

function deleteTraining(accessToken: string): DeleteTraining {
  return new DeleteTraining(trainingGateway(accessToken));
}

export const Inject = {
  GetMyEnrollmentRequests : getMyEnrollmentRequests,
  RequestEnrollment : requestEnrollment,
  TrainingGateway : trainingGateway,
  CreateTraining : createTraining,
  UpdateTraining : updateTraining,
  DeleteTraining : deleteTraining,
  GetDependants : getDependants,
  GetTrainings : getTrainings,
  SearchClubs : searchClubs,
}