import { LoanService } from './../../services/loan.service';
import { MemberService } from '../../services/member.service';
import { BookService } from '../../services/book.service';
import { Loan } from './../../models/loan.model';
import { Member } from '../../models/member.model';
import { Book } from '../../models/book.model';
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TableComponent } from '../../shared/table/table.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableColumn } from '../../models/table-column.model';
import { ModalConfig } from '../../models/modal-field.model';
import { getApiError } from '../../core/api-error.util';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent, ModalComponent],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss',
})
export class LoansComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private loanService = inject(LoanService);
  private memberService = inject(MemberService);
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);
  apiError = '';

  @ViewChild('modal') modal!: ModalComponent;

  loans: Loan[] = [];
  members: Member[] = [];
  books: Book[] = [];
  selectedLoan: Loan | null = null;
  isLoading = false;
  errorMsg = '';

  message = '';
  messageType: 'success' | 'error' | '' = '';

  isExpanded = false;

  form = this.fb.group({
    memberId: ['', Validators.required],
    bookId: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  toggleForm() {
    this.isExpanded = !this.isExpanded;
  }

  async save() {
    this.message = '';
    this.messageType = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await firstValueFrom(this.loanService.create(this.form.getRawValue()));

      this.message = 'Prétamo registrado correctamente.';
      this.messageType = 'success';
      this.cdr.detectChanges();

      this.form.reset();
      this.loadLoans();
    } catch (err) {
      this.message = getApiError(err, 'No fue posible registrar el préstamo.');
      this.messageType = 'error';
      this.cdr.detectChanges();
    }
  }

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Miembro', accessor: 'memberName' },
    { type: 'text', label: 'Libro', accessor: 'bookTitle' },
    { type: 'date', label: 'Fecha de préstamo', accessor: 'loanDate' },
    { type: 'date', label: 'Fecha de entrega', accessor: 'DueDate' },
    { type: 'date', label: 'Fecha de devolución', accessor: 'returnDate' },
    { type: 'text', label: 'Estado', accessor: 'status' },
    {
      type: 'actions',
      label: 'Devolución',
      actions: [
        {
          icon: 'fa-solid fa-reply',
          tooltip: 'Registrar devolución',
          disabled: (row) => row.status === 'Returned',
          onClick: (row) => this.openModal(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'loanModal',
    title: '¿Desea registrar la devolución del libro?',
    fields: [
      {
        type: 'text',
        key: 'id',
        label: 'ID',
        icon: 'fa-solid fa-id-card',
        visible: false,
      },
      {
        type: 'text',
        key: 'memberName',
        label: 'Miembro',
        icon: 'fa-solid fa-id-card',
        readonly: true
      },
      {
        type: 'text',
        key: 'bookTitle',
        label: 'Libro',
        icon: 'fa-solid fa-user',
        readonly: true
      },
    ],
  };

  ngOnInit(): void {
    this.loadLoans();
    this.loadMembers();
    this.loadBooks();
  }

  loadLoans(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.loanService.getAll().subscribe({
      next: (data) => {
        this.loans = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar los préstamos.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  loadMembers(): void {
    this.memberService.getAll().subscribe({
      next: (data) => (this.members = data),
    });
  }

  loadBooks(): void {
    this.bookService.getAll().subscribe({
      next: (data) => (this.books = data),
    });
  }

  openModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.modal.open();
  }

  onModalClose(): void {
    this.selectedLoan = null;
    this.apiError = '';
  }

  onSave(formData: Loan): void {
    const { id, ...dto } = formData;

    this.loanService.returnLoan(id).subscribe({
      next: () => {
        this.modal.closeModal();
        this.loadLoans();
      },
      error: (err) => {
        this.apiError = getApiError(err, 'No fue posible devolver el préstamo.');
      },
    });
  }
}
