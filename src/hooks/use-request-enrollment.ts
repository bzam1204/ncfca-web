import {useMutation, useQueryClient} from "@tanstack/react-query";

import {RequestEnrollmentDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {requestEnrollmentAction} from "@/infraestructure/actions/request-enrollment.action";
import {QueryKeys} from "@/infraestructure/query-keys";

export function useRequestEnrollment() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RequestEnrollmentDto>({
    mutationFn : requestEnrollmentAction,
    onSuccess : () => queryClient.invalidateQueries({queryKey : QueryKeys.enrollments.myRequests()}),
  });
}
