'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/infraestructure/cache/query-keys';
import { approveEnrollmentAction } from '@/infraestructure/actions/admin/approve-enrollment.action';
import { rejectEnrollmentAction } from '@/infraestructure/actions/admin/reject-enrollment.action';

export const useAdminApproveEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, clubId }: { enrollmentId: string; clubId: string }) => 
      approveEnrollmentAction(clubId, enrollmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubEnrollmentsPending(variables.clubId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubMembers(variables.clubId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubCharts(variables.clubId) });
    }
  });
};

export const useAdminRejectEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, clubId, rejectionReason }: { enrollmentId: string; clubId: string; rejectionReason?: string }) => 
      rejectEnrollmentAction(clubId, enrollmentId, rejectionReason ? { rejectionReason } : undefined),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubEnrollmentsPending(variables.clubId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.admin.clubCharts(variables.clubId) });
    }
  });
};