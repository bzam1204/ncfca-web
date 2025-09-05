'use server';

import { SearchDependantsFilter, SearchDependantsView } from '@/contracts/api/dependants-search.dto';
import { PaginationDto } from '@/contracts/api/pagination.dto';

import { Inject } from '@/infrastructure/containers/container';
import { auth } from '@/infrastructure/auth';

export async function searchDependantsAction(
  filter: SearchDependantsFilter,
  pagination?: PaginationDto,
): Promise<SearchDependantsView> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Session is not valid');
  const gateway = Inject.FamilyGateway(session.accessToken);
  return gateway.searchDependants(filter, pagination);
}

