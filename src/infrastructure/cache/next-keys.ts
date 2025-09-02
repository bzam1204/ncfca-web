import { SearchClubMembersQueryDto } from '@/contracts/api/admin.dto';

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
  admin: {
    all: ['admin'],
    clubs: 'admin.clubs',
    users: 'admin.users',
    clubCharts: (clubId: string) => `admin.club_charts.${clubId}`,
    userFamily: (userId: string) => `admin.user_family.${userId}`,
    clubMembers: (clubId: string) => `admin.club_members.${clubId}`,
    searchUsers: 'admin.search_users',
    enrollments: 'admin.enrollments',
    affiliations: 'admin.affiliations',
    // new pattern, follow to the next implementations
    searchClubMembers: (query: SearchClubMembersQueryDto): string[] => [...NextKeys.admin.all, 'search_club_members', JSON.stringify(query)],
  },
};
