export interface ClubMemberDto {
  id: string;
  avatarUrl: string | null; // URL da foto do membro, opcional
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  holder: HolderDto
  memberSince: Date; // Data de adesão ao clube
}

export interface HolderDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
