import {MyEnrollmentRequestsDto, RequestEnrollmentDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

export interface EnrollmentGateway {
  requestEnrollment(input: RequestEnrollmentDto): Promise<void>;

  myRequests(): Promise<MyEnrollmentRequestsDto[]>
}
