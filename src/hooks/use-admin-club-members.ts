'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ClubMemberDto } from '@/contracts/api/club-member.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAdminClubMembers = async (clubId: string, accessToken: string): Promise<ClubMemberDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${clubId}/members`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Falha ao buscar membros do clube.');
  const data = await res.json();
  return data.members;
};

export function useAdminClubMembers(clubId: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  return useQuery({
    queryKey: ['admin-club-members', clubId],
    queryFn: () => getAdminClubMembers(clubId, accessToken),
    enabled: !!clubId && !!accessToken,
  });
}