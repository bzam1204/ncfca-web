import { SearchClubMembersFilterDto } from '@/contracts/api/admin.dto';
import { SearchMyClubMembersQuery } from '@/contracts/api/club-member.dto';
import { SearchClubsQuery } from '@/contracts/api/club.dto';
import { SearchUsersQuery } from '@/contracts/api/user.dto';
import { PaginationDto } from '@/contracts/api/pagination.dto';

export const QueryKeys = {
  enrollments: {
    all: ['enrollments'] as const,
    myRequests: () => [...QueryKeys.enrollments.all, 'my-enrollments-requests'] as const,
  },
  dependants: {
    all: ['dependants'] as const,
    details: (dependantId: string) => [...QueryKeys.dependants.all, dependantId] as const,
  },
  clubs: {
    all: ['clubs'] as const,
    search: {
      all: () => [...QueryKeys.clubs.all, 'search'],
      query: (query: SearchClubsQuery) => [...QueryKeys.clubs.search.all(), query] as const,
    },
    myClub: () => [...QueryKeys.clubs.all, 'my-club'] as const,
    details: (clubId: string) => [...QueryKeys.clubs.all, 'details', clubId] as const,
  },
  club: {
    all: ['club'] as const,
    members: (clubId: string) => ['club', clubId, 'members'] as const,
    myClubMembers: (query: SearchMyClubMembersQuery) => [...QueryKeys.club.all, 'my-club-members', query] as const,
    enrollmentHistory: (clubId: string) => ['club', clubId, 'enrollment-history'] as const,
    pendingEnrollments: (clubId: string) => ['club', clubId, 'pending-enrollments'] as const,
  },
  myClub: {
    all: ['myClub'] as const,
    members: (query?: SearchMyClubMembersQuery) => [...QueryKeys.myClub.all, 'members', query ?? '*'] as const,
    pendingEnrollmentsRequests: () => [...QueryKeys.myClub.all, 'pending-enrollments-requests'] as const,
  },
  clubRequests: {
    all: ['clubRequests'] as const,
    admin: {
      pending: () => [...QueryKeys.clubRequests.all, 'admin', 'pending'] as const,
    },
    myRequests: () => [...QueryKeys.clubRequests.all, 'my-requests'] as const,
  },
  trainings: {
    all: ['trainings'] as const,
  },
  admin: {
    affiliations: () => ['admin', 'affiliations'] as const,
    clubs: () => ['admin', 'clubs'] as const,
    clubById: (clubId: string) => ['admin', 'clubs', clubId] as const,
    clubMembers: (clubId: string, filter?: SearchClubMembersFilterDto, pagination?: PaginationDto) =>
      ['admin', 'clubs', clubId, 'members', filter, pagination] as const,
    clubCharts: (clubId: string) => ['admin', 'clubs', clubId, 'charts'] as const,
    clubEnrollmentsPending: (clubId: string) => ['admin', 'clubs', clubId, 'enrollments', 'pending'] as const,
    searchUsers: (query: SearchUsersQuery) => ['admin', 'users', 'search', query] as const,
    userById: (userId: string) => ['admin', 'users', userId] as const,
    userFamily: (userId: string) => ['admin', 'users', userId, 'family'] as const,
  },
};
