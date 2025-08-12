'use client';

import { useQuery } from '@tanstack/react-query';
import { Club } from '@/domain/entities/entities';
import {getClubAction} from "@/infraestructure/actions/get-club";
import {QueryKeys} from "@/infraestructure/cache/query-keys";

export function useAdminClubById(clubId: string, initialData: Club) {
  return useQuery({
    queryKey: QueryKeys.clubs.details(clubId),
    queryFn: () => getClubAction(clubId),
    initialData: initialData,
    staleTime: 1000 * 60 * 5,
  });
}