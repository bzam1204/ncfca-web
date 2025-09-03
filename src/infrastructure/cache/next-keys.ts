import { SearchClubMembersQueryDto } from '@/contracts/api/admin.dto';
import { SearchMyClubMembersQuery } from '@/contracts/api/club-member.dto';

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
};
