import {RequestEnrollmentDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";
import {EnrollmentGateway} from "@/application/gateways/enrollment/enrollment.gateway";

export class RequestEnrollment {

  constructor(private readonly enrollmentGateway: EnrollmentGateway) {
  }

  async execute(input: RequestEnrollmentDto): Promise<void> {
    return await this.enrollmentGateway.requestEnrollment(input);
  }

}
