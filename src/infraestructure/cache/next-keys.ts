export const NextKeys = {
  trainings : "trainings",
  family : {
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
  }
}
