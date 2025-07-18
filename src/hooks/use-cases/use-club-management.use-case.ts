// src/hooks/use-cases/use-club-management.use-case.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateClubDto, RejectEnrollmentDto, UpdateClubDto } from '@/contracts/api/club-management.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- AÇÕES DA API ---

const createClub = async (payload: { data: CreateClubDto, accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/club`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao criar o clube.');
  return res.json();
};

export const useCreateClubMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      // Após a criação, invalida a query que busca os dados do clube do diretor.
      // Isso forçará a página de gestão a buscar os dados do clube recém-criado.
      return queryClient.invalidateQueries({ queryKey: ['my-club'] });
    },
  });
};

const updateClub = async (payload: { clubId: string, data: UpdateClubDto, accessToken: string }) => {
    const res = await fetch(`${BACKEND_URL}/club-management/${payload.clubId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
      body: JSON.stringify(payload.data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Falha ao atualizar o clube.');
};

const approveEnrollment = async (payload: { enrollmentId: string, accessToken: string }) => {
    const res = await fetch(`${BACKEND_URL}/club-management/enrollments/${payload.enrollmentId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${payload.accessToken}` },
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Falha ao aprovar matrícula.');
};

const rejectEnrollment = async (payload: { enrollmentId: string, data: RejectEnrollmentDto, accessToken: string }) => {
    const res = await fetch(`${BACKEND_URL}/club-management/enrollments/${payload.enrollmentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
        body: JSON.stringify(payload.data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Falha ao rejeitar matrícula.');
};

// --- HOOKS DE MUTATION ---

export const useClubManagementMutations = () => {
    const queryClient = useQueryClient();

    const onEnrollmentActionSuccess = () => {
        // Invalida tanto as pendentes quanto os membros ativos para garantir que a UI esteja sempre sincronizada.
        queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
        queryClient.invalidateQueries({ queryKey: ['club-members'] });
    }

    const useCreateClub = () => useMutation({
        mutationFn: createClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-club'] });
        }
    });

    const useUpdateClub = () => useMutation({
        mutationFn: updateClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-club'] });
        }
    });

    const useApproveEnrollment = () => useMutation({
        mutationFn: approveEnrollment,
        onSuccess: onEnrollmentActionSuccess
    });
    
    const useRejectEnrollment = () => useMutation({
        mutationFn: rejectEnrollment,
        onSuccess: onEnrollmentActionSuccess
    });

    return { useCreateClub, useUpdateClub, useApproveEnrollment, useRejectEnrollment };
};