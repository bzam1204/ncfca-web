'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infrastructure/cache/query-keys';
import { approveEnrollmentAction } from '@/infrastructure/actions/approve-enrollment.action';
import { rejectEnrollmentAction } from '@/infrastructure/actions/reject-enrollment.action';

interface ApproveEnrollmentParams {
  clubId: string;
  enrollmentId: string;
}

interface RejectEnrollmentParams {
  clubId: string;
  enrollmentId: string;
  rejectionReason: string;
}

export function useApproveEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId }: ApproveEnrollmentParams) => approveEnrollmentAction(enrollmentId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}

export function useRejectEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, rejectionReason }: RejectEnrollmentParams) => rejectEnrollmentAction(enrollmentId, rejectionReason),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}
