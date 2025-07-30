import {useQuery} from "@tanstack/react-query";

import {MyEnrollmentRequestsDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {getMyEnrollmentRequestsAction} from "@/infraestructure/actions/get-my-enrollment-requests.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useGetMyEnrollmentRequests() {
  return useQuery<MyEnrollmentRequestsDto[]>({
    queryKey : QueryKeys.enrollments.myRequests(),
    queryFn : getMyEnrollmentRequestsAction,
  });
}
