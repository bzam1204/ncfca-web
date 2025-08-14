import {SearchClubsQuery} from "@/contracts/api/club.dto";
import {SearchUsersQuery} from "@/contracts/api/user.dto";

export const QueryKeys = {
  enrollments : {
    all : ['enrollments'] as const,
    myRequests : () => [...QueryKeys.enrollments.all, 'my-enrollments-requests'] as const,
  },
  dependants : {
    all : ['dependants'] as const,
  },
  clubs : {
    all : ['clubs'] as const,
    search : {
      all : () => [...QueryKeys.clubs.all, 'search'],
      query : (query: SearchClubsQuery) => [...QueryKeys.clubs.search.all(), query] as const
    },
    myClub : () => [...QueryKeys.clubs.all, 'my-club'] as const,
    details : (clubId: string) => [...QueryKeys.clubs.all, 'details', clubId] as const,
  },
  clubRequests : {
    all : ['clubRequests'] as const,
    admin : {
      pending : () => [...QueryKeys.clubRequests.all, 'admin', 'pending'] as const,
    },
    myRequests : () => [...QueryKeys.clubRequests.all, 'my-requests'] as const,
  },
  trainings : {
    all : ['trainings'] as const,
  },
  admin : {
    clubs : () => ['admin', 'clubs'] as const,
    clubById : (clubId: string) => ['admin', 'clubs', clubId] as const,
    searchUsers : (query: SearchUsersQuery) => ['admin', 'users', 'search', query] as const,
    userById : (userId: string) => ['admin', 'users', userId] as const,
  }
}
