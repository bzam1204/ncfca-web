'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {RejectEnrollmentDto, UpdateClubDto} from '@/contracts/api/club-management.dto';
import {ClubDto} from '@/contracts/api/club.dto';
import {EnrollmentRequestDto, PendingEnrollmentDto} from '@/contracts/api/enrollment.dto';
import {ClubMemberDto} from '@/contracts/api/club-member.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- API FETCHING FUNCTIONS ---

const getMyClub = async (accessToken: string): Promise<ClubDto | null> => {
  const res = await fetch(`${BACKEND_URL}/club-management/my-club`, {
    headers : {'Authorization' : `Bearer ${accessToken}`}
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Falha ao buscar os dados do seu clube.');
  return res.json();
};

const getPendingEnrollments = async (clubId: string, accessToken: string): Promise<PendingEnrollmentDto[]> => {
  const res = await fetch(`${BACKEND_URL}/club-management/${clubId}/enrollments/pending`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar solicitações pendentes.');
  return res.json();
}

// NOVO: Busca o histórico completo de matrículas
const getEnrollmentHistory = async (accessToken: string): Promise<EnrollmentRequestDto[]> => {
  const res = await fetch(`${BACKEND_URL}/club-management/my-club/enrollments`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar histórico de matrículas.');
  return res.json();
}

const getClubMembers = async (accessToken: string): Promise<ClubMemberDto[]> => {
  const res = await fetch(`${BACKEND_URL}/club-management/my-club/members`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
  });
  if (!res.ok) throw new Error('Falha ao buscar membros do clube.');
  return res.json();
}

const createClub = async (payload: {data: any, accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/club`, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao criar o clube.');
  return res.json();
};

const updateClub = async (payload: {clubId: string, data: UpdateClubDto, accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/club-management/${payload.clubId}`, {
    method : 'PATCH',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao atualizar o clube.');
};

const approveEnrollment = async (payload: {enrollmentId: string, accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/club-management/enrollments/${payload.enrollmentId}/approve`, {
    method : 'POST',
    headers : {'Authorization' : `Bearer ${payload.accessToken}`},
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao aprovar matrícula.');
};

const rejectEnrollment = async (payload: {enrollmentId: string, data: RejectEnrollmentDto, accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/club-management/enrollments/${payload.enrollmentId}/reject`, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${payload.accessToken}`},
    body : JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao rejeitar matrícula.');
};

const revokeMembership = async (payload: {membershipId: string, accessToken: string}) => {
  const res = await fetch(`${BACKEND_URL}/club-management/membership/${payload.membershipId}/revoke`, {
    method : 'POST',
    headers : {'Authorization' : `Bearer ${payload.accessToken}`},
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Falha ao remover membro.');
}

// --- QUERY HOOKS ---

export const useMyClubQuery = (accessToken: string) => useQuery({
  queryKey : ['my-club'],
  queryFn : () => getMyClub(accessToken),
  enabled : !!accessToken,
  retry : 1,
});

export const usePendingEnrollmentsQuery = (clubId: string, accessToken: string) => useQuery({
  queryKey : ['pending-enrollments', clubId],
  queryFn : () => getPendingEnrollments(clubId, accessToken),
  enabled : !!clubId && !!accessToken,
});

export const useEnrollmentHistoryQuery = (accessToken: string) => useQuery({
  queryKey : ['enrollments-history'],
  queryFn : () => getEnrollmentHistory(accessToken),
  enabled : !!accessToken,
});

export const useClubMembersQuery = (accessToken: string) => useQuery({
  queryKey : ['club-members'],
  queryFn : () => getClubMembers(accessToken),
  enabled : !!accessToken,
});

// --- MUTATION HOOKS ---
export const useCreateClubMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : createClub,
    onSuccess : () => {
      return queryClient.invalidateQueries({queryKey : ['my-club']});
    },
  });
};

export const useUpdateClubMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : updateClub,
    onSuccess : () => {
      return queryClient.invalidateQueries({queryKey : ['my-club']});
    }
  });
}

export const useApproveEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : approveEnrollment,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['pending-enrollments']});
      queryClient.invalidateQueries({queryKey : ['club-members']});
      queryClient.invalidateQueries({queryKey : ['my-club']})
    }
  });
}

export const useRejectEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : rejectEnrollment,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['pending-enrollments']});
      queryClient.invalidateQueries({queryKey : ['club-members']});
    }
  });
}

export const useRevokeMembershipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : revokeMembership,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['club-members']});
      queryClient.invalidateQueries({queryKey : ['my-club']});
    }
  });
}
