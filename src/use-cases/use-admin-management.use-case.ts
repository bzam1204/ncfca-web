// src/hooks/use-cases/use-admin-management.use-case.ts
'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {UserDto} from '@/contracts/api/user.dto'; // Supondo que este DTO exista
import {ClubDto} from '@/contracts/api/club.dto';
import {FamilyResponseDto} from '@/contracts/api/family.dto';
import {EnrollmentRequestDto} from '@/contracts/api/enrollment.dto';
import {ManageUserRoleDto} from "@/contracts/api/admin.dto";
import {AffiliationDto} from "@/contracts/api/affiliation.dto";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- FUNÇÕES DE DATA FETCHING (LÓGICA BRUTA) ---

// UC10: Listar todos os usuários
const listUsers = async (accessToken: string): Promise<UserDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/users`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de usuários.');
  return res.json();
};

// UC10: Visualizar detalhes da família de um usuário
const viewUserFamily = async (userId: string, accessToken: string): Promise<FamilyResponseDto> => {
  const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/family`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar os detalhes da família do usuário.');
  return res.json();
};

// UC11: Listar todos os clubes
const listClubs = async (accessToken: string): Promise<ClubDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de clubes.');
  return res.json();
};

// UC11: Listar todas as matrículas
const listAllEnrollments = async (accessToken: string): Promise<EnrollmentRequestDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/enrollments`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar todas as solicitações de matrícula.');
  return res.json();
};

// UC12: Listar todas as afiliações
const listAffiliations = async (accessToken: string): Promise<AffiliationDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/affiliations`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar a lista de afiliações.');
  return res.json();
};

// UC13 (Parcial): Gerenciar perfis de um usuário
const manageUserRole = async (payload: {userId: string; data: ManageUserRoleDto; accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/admin/users/${payload.userId}/roles`, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao atualizar perfis do usuário.');
};

// UC11: Alterar diretor de um clube
const changeClubDirector = async (payload: {clubId: string; data: {newDirectorId: string}; accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${payload.clubId}/director`, {
    method : 'PATCH',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao alterar o diretor do clube.');
};

// --- HOOKS REACT-QUERY (ABSTRAÇÕES PARA COMPONENTES) ---

// Hook para UC10: Listar Usuários
export const useAdminListUsers = (accessToken: string) => useQuery({
  queryKey : ['admin-users'],
  queryFn : () => listUsers(accessToken),
  enabled : !!accessToken,
});

// Hook para UC10: Ver Família do Usuário
export const useAdminViewUserFamily = (userId: string | null, accessToken: string) => useQuery({
  queryKey : ['admin-user-family', userId],
  queryFn : () => viewUserFamily(userId!, accessToken),
  enabled : !!userId && !!accessToken,
});

// Hook para UC11: Listar Clubes
export const useAdminListClubs = (accessToken: string) => useQuery({
  queryKey : ['admin-clubs'],
  queryFn : () => listClubs(accessToken),
  enabled : !!accessToken,
});

// Hook para UC11: Listar todas as matrículas
export const useAdminListAllEnrollments = (accessToken: string) => useQuery({
  queryKey : ['admin-enrollments'],
  queryFn : () => listAllEnrollments(accessToken),
  enabled : !!accessToken,
});

// Hook para UC12: Listar Afiliações
export const useAdminListAffiliations = (accessToken: string) => useQuery({
  queryKey : ['admin-affiliations'],
  queryFn : () => listAffiliations(accessToken),
  enabled : !!accessToken,
});

// Hook para UC13 (Parcial): Mutação para Gerenciar Perfis
export const useAdminManageUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : manageUserRole,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['admin-users']});
    },
  });
};

// Hook para UC11: Mutação para Alterar Diretor
export const useAdminChangeClubDirectorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : changeClubDirector,
    onSuccess : () => {
      // Invalida a lista de clubes para refletir a mudança de diretor
      queryClient.invalidateQueries({queryKey : ['admin-clubs']});
    },
  });
};
