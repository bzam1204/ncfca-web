'use client';

import { useQuery } from "@tanstack/react-query";
import { getPendingClubRequestsAction } from "@/infraestructure/actions/admin/get-pending-club-requests.action";
import { QueryKeys } from "@/infraestructure/cache/query-keys";
import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";

export function usePendingClubRequests(initialData: ClubRequestStatusDto[]) {
  return useQuery({
    queryKey: QueryKeys.clubRequests.admin.pending(),
    queryFn: () => getPendingClubRequestsAction(),
    initialData: initialData,
    select: (data) => data || [], // Ensure we always return an array
  });
}
