import {useMutation, useQueryClient} from "@tanstack/react-query";

import {RequestEnrollmentDto} from "@/application/gateways/enrollment/enrollment.gateway.dto";

import {requestEnrollmentAction} from "@/infrastructure/actions/request-enrollment.action";
import {QueryKeys} from "@/infrastructure/cache/query-keys";

export function useRequestEnrollment() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RequestEnrollmentDto>({
    mutationFn : requestEnrollmentAction,
    onSuccess : () => queryClient.invalidateQueries({queryKey : QueryKeys.enrollments.myRequests()}),
  });
}
