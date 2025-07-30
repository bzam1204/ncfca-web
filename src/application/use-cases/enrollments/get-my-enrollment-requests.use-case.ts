import {MyEnrollmentRequestsDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";
import {EnrollmentGateway} from "@/application/gateways/enrollment/enrollment.gateway";

export class GetMyEnrollmentRequests {

  constructor(private readonly enrollmentGateway: EnrollmentGateway) {
  }

  async execute(): Promise<MyEnrollmentRequestsDto[]> {
    return await this.enrollmentGateway.myRequests();
  }

}
