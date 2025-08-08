'use client';

import { useQuery } from "@tanstack/react-query";
import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { getMyClubRequestsAction } from "@/infraestructure/actions/get-my-club-requests.action";
import { QueryKeys } from "@/infraestructure/cache/query-keys";

export function useMyClubRequests(initialData: ClubRequestStatusDto[]) {
  return useQuery({
    queryKey: QueryKeys.clubRequests.myRequests(),
    queryFn: () => getMyClubRequestsAction(),
    initialData: initialData,
  });
} 
