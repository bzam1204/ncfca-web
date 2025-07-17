// src/hooks/use-cases/use-manage-dependants.use-case.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddDependantRequestDto, UpdateDependantRequestDto } from '@/contracts/api/dependant.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const addDependant = async (payload: { data: AddDependantRequestDto, accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/dependants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao adicionar dependente.');
  return res.json();
};

const updateDependant = async (payload: { id: string, data: UpdateDependantRequestDto, accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/dependants/${payload.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${payload.accessToken}` },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao atualizar dependente.');
};

const deleteDependant = async (payload: { id: string, accessToken: string }) => {
  const res = await fetch(`${BACKEND_URL}/dependants/${payload.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${payload.accessToken}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao excluir dependente.');
};

export const useAddDependantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { data: AddDependantRequestDto, accessToken: string }) => addDependant(payload),
    onSuccess: () => {
      // Invalida a query da lista de dependentes para forçar o refetch.
      return queryClient.invalidateQueries({ queryKey: ['dependants'] });
    },
  });
};

export const useUpdateDependantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string, data: UpdateDependantRequestDto, accessToken: string }) => updateDependant(payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['dependants'] });
    },
  });
};

export const useDeleteDependantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string, accessToken: string }) => deleteDependant(payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['dependants'] });
    },
  });
};