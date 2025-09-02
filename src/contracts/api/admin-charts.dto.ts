export interface AdminClubChartsDto {
  memberCountByType: { type: string; count: number }[];
  memberCountBySex: { sex: string; count: number }[];
  enrollmentsOverTime: { month: string; count: number }[];
  totalActiveMembers: number;
  totalPendingEnrollments: number;
}
