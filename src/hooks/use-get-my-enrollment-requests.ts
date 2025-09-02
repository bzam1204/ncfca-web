import {useQuery} from "@tanstack/react-query";

import {MyEnrollmentRequestsDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {getMyEnrollmentRequestsAction} from "@/infrastructure/actions/get-my-enrollment-requests.action";
import {QueryKeys} from "@/infrastructure/cache/query-keys";

export function useGetMyEnrollmentRequests() {
  return useQuery<MyEnrollmentRequestsDto[]>({
    queryKey : QueryKeys.enrollments.myRequests(),
    queryFn : getMyEnrollmentRequestsAction,
  });
}
