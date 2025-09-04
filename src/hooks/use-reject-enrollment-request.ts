'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rejectEnrollmentAction as rejectEnrollmentRequestAction } from '@/infrastructure/actions/reject-enrollment-request.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export default function useRejectEnrollmentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, rejectionReason }: RejectEnrollmentParams) => rejectEnrollmentRequestAction(enrollmentId, rejectionReason),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.myClub.enrollmentRequests() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.myClub.all });
    },
  });
}

interface RejectEnrollmentParams {
  rejectionReason: string;
  enrollmentId: string;
  clubId: string;
}
