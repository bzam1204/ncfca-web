'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { PendingEnrollmentDto } from '@/contracts/api/enrollment.dto';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAdminClubRequests = async (clubId: string, accessToken: string): Promise<PendingEnrollmentDto[]> => {
  const res = await fetch(`${BACKEND_URL}/admin/clubs/${clubId}/enrollments/pending`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Falha ao buscar solicitações de matrícula do clube.');
  return res.json();
};

export function useAdminClubRequests(clubId: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? '';

  return useQuery({
    queryKey: ['admin-club-requests', clubId],
    queryFn: () => getAdminClubRequests(clubId, accessToken),
    enabled: !!clubId && !!accessToken,
  });
}