'use client';

import {useQuery} from '@tanstack/react-query';

import {Club} from "@/domain/entities/entities";

import {getMyClubAction} from '@/infraestructure/actions/get-my-club.action';
import {QueryKeys} from '@/infraestructure/cache/query-keys';

export function useMyClub(initialData: Club | null) {
  return useQuery({
    queryKey : QueryKeys.clubs.myClub(),
    queryFn : () => getMyClubAction(),
    initialData : initialData,
  });
}