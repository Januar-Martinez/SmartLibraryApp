export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  returnDate: string;
  status: boolean;
}

export type CreateLoanDto = Omit<Loan, 'id' | 'memberName' | 'bookTitle' | 'loanDate' | 'returnDate' | 'status'>;