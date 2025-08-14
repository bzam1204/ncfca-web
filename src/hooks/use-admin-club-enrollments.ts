'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RejectEnrollmentDto } from '@/contracts/api/club-management.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const adminApproveEnrollment = async (payload: { enrollmentId: string; clubId: string; accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${payload.clubId}/enrollments/${payload.enrollmentId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${payload.accessToken}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao aprovar matrícula.');
};

const adminRejectEnrollment = async (payload: { enrollmentId: string; clubId: string; data: RejectEnrollmentDto; accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${payload.clubId}/enrollments/${payload.enrollmentId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao rejeitar matrícula.');
};

export const useAdminApproveEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApproveEnrollment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-requests', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['admin-club-members', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['admin-club-charts', variables.clubId] });
    }
  });
};

export const useAdminRejectEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminRejectEnrollment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-club-requests', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['admin-club-charts', variables.clubId] });
    }
  });
};