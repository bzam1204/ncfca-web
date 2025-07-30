import {SearchClubsQuery} from "@/contracts/api/club.dto";

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
    search : (query: SearchClubsQuery) => [...QueryKeys.clubs.all, 'search', query] as const,
  },
  trainings: {
    all: ['trainings'] as const,
  }
}
