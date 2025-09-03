'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approveEnrollmentAction } from '@/infrastructure/actions/approve-enrollment.action';
import { rejectEnrollmentAction } from '@/infrastructure/actions/reject-enrollment.action';
import { QueryKeys } from '@/infrastructure/cache/query-keys';

interface ApproveEnrollmentParams {
  enrollmentId: string;
  clubId: string;
}


interface RejectEnrollmentParams {
  rejectionReason: string;
  enrollmentId: string;
  clubId: string;
}

//todo: move the its own file as the other hooks

export function useApproveEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId }: ApproveEnrollmentParams) => approveEnrollmentAction(enrollmentId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}

//todo: move the its own file as the other hooks
export function useRejectEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, rejectionReason }: RejectEnrollmentParams) => rejectEnrollmentAction(enrollmentId, rejectionReason),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}
