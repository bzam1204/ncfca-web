export const NextKeys = {
  trainings : "trainings",
  family : {
    mine : "family.me",
    myDependants : "family.my_dependants"
  },
  clubRequests : {
    myRequests : "my_club_requests",
    admin : {
      pending : "admin_pending_club_requests"
    }
  },
  clubs : {
    details : (clubId: string) => `clubs.details.${clubId}`
  },
  admin : {
    affiliations : "admin.affiliations",
    enrollments : "admin.enrollments",
    clubs : "admin.clubs",
    users : "admin.users",
    searchUsers : "admin.search_users",
    clubMembers : (clubId: string) => `admin.club_members.${clubId}`,
    clubCharts : (clubId: string) => `admin.club_charts.${clubId}`,
    userFamily : (userId: string) => `admin.user_family.${userId}`,
  }
}
