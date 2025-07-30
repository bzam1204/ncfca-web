'use server';

import {PaginatedClubDto, SearchClubsQuery} from "@/contracts/api/club.dto";

import {Inject} from "@/infraestructure/containers/container";
import {auth} from "@/infraestructure/auth";

export async function searchClubsAction(query: SearchClubsQuery): Promise<PaginatedClubDto> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const searchClubs = Inject.SearchClubs(session.accessToken);
  return searchClubs.execute(query);
}
