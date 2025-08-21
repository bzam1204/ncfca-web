'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { approveEnrollmentAction } from '@/infraestructure/actions/approve-enrollment.action';
import { rejectEnrollmentAction } from '@/infraestructure/actions/reject-enrollment.action';

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
    mutationFn: ({ clubId, enrollmentId }: ApproveEnrollmentParams) => 
      approveEnrollmentAction(clubId, enrollmentId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}

export function useRejectEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, enrollmentId, rejectionReason }: RejectEnrollmentParams) => 
      rejectEnrollmentAction(clubId, enrollmentId, rejectionReason),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.club.enrollmentHistory(clubId) });
    },
  });
}