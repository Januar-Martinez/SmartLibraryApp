export interface Member {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export type CreateMemberDto = Omit<Member, 'id' | 'isActive'>;

export type UpdateMemberDto = Omit<Member, 'id'>;