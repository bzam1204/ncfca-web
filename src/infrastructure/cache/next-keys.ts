import { SearchClubMembersQueryDto } from '@/contracts/api/admin.dto';
import { SearchMyClubMembersQuery } from '@/contracts/api/club-member.dto';
import { SearchTournamentsQuery } from '@/contracts/api/tournament.dto';
import { SearchDependantsFilter } from '@/contracts/api/dependants-search.dto';

export const NextKeys = {
  trainings: 'trainings',
  family: {
    mine: 'family.me',
    myDependants: 'family.my_dependants',
  },
  clubRequests: {
    myRequests: 'my_club_requests',
    admin: {
      pending: 'admin_pending_club_requests',
    },
  },
  clubs: {
    details: (clubId: string) => `clubs.details.${clubId}`,
  },
  myClub: {
    all: 'my_club',
    members: (query?: SearchMyClubMembersQuery) => `my_club.search_members.${query ?? ''}`,
  },
  admin: {
    all: 'admin',
    clubs: 'admin.clubs',
    users: 'admin.users',
    clubCharts: (clubId: string) => `admin.club_charts.${clubId}`,
    userFamily: (userId: string) => `admin.user_family.${userId}`,
    clubMembers: (clubId: string) => `admin.club_members.${clubId}`,
    searchUsers: 'admin.search_users',
    enrollments: 'admin.enrollments',
    affiliations: 'admin.affiliations',
    searchClubMembers: (query: SearchClubMembersQueryDto): string => `admin_search_club_members_${JSON.stringify(query)}`,
  },
  tournaments: {
    // Broad tag for all tournament-related server cache
    all: 'tournaments',
    search: (query: SearchTournamentsQuery): string => `tournaments.search.${JSON.stringify(query)}`,
    details: (id: string) => `tournaments.details.${id}`,
  },
  featuredTournaments: {
    list: 'featured_tournaments.list',
  },
  registrations: {
    mine: 'registrations.mine',
    pending: 'registrations.pending',
  },
  dependants: {
    search: (query: SearchDependantsFilter): string => `dependants.search.${JSON.stringify(query)}`,
  },
};
