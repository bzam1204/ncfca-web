'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approveEnrollmentRequestAction } from '@/infrastructure/actions/approve-enrollment-request.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

export default function useApproveEnrollmentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId }: ApproveEnrollmentParams) => approveEnrollmentRequestAction(enrollmentId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.myClub.enrollmentRequests() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.myClub.all });
    },
  });
}

interface ApproveEnrollmentParams {
  enrollmentId: string;
  clubId: string;
}
