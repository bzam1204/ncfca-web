export interface HolderDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface ClubMemberDto {
  id: string;
  dependantId: string;
  dependantName: string;
  dependantAge: number;
  dependantType: string;
  dependantSex: string;
  dependantEmail: string | null;
  dependantPhone: string | null;
  dependantBirthDate: string;
  joinedAt: string;
  status: string;
  holder: HolderDto;
}
