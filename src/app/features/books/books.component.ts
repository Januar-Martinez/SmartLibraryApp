import { BookService } from './../../services/book.service';
import { Book } from './../../models/book.model';
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TableComponent } from '../../shared/table/table.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableColumn } from '../../models/table-column.model';
import { ModalConfig } from '../../models/modal-field.model';
import { getApiError } from '../../core/api-error.util';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent, ModalComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);
  apiError = '';

  @ViewChild('modal') modal!: ModalComponent;

  books: Book[] = [];
  selectedBook: Book | null = null;
  isLoading = false;
  errorMsg = '';

  message = '';
  messageType: 'success' | 'error' | '' = '';

  isExpanded = false;

  form = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    stock: [0, Validators.required],
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
      await firstValueFrom(this.bookService.create(this.form.getRawValue()));

      this.message = 'Libro registrado correctamente.';
      this.messageType = 'success';
      this.cdr.detectChanges();

      this.form.reset();
      this.loadBooks();
    } catch (err) {
      this.message = getApiError(err, 'No fue posible registrar el libro.');
      this.messageType = 'error';
      this.cdr.detectChanges();
    }
  }

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Titulo', accessor: 'title' },
    { type: 'text', label: 'Autor', accessor: 'author' },
    { type: 'text', label: 'Stock', accessor: 'stock' },
    {
      type: 'actions',
      label: 'actualizar',
      actions: [
        {
          icon: 'fa-solid fa-pencil',
          tooltip: 'Actualizar',
          onClick: (row: Book) => this.openModal(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'bookModal',
    title: 'Editar Libro',
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
        key: 'title',
        label: 'Título',
        icon: 'fa-solid fa-book',
        required: true,
      },
      {
        type: 'text',
        key: 'author',
        label: 'Autor',
        icon: 'fa-solid fa-user-pen',
        required: true,
      },
      {
        type: 'number',
        key: 'stock',
        label: 'Stock',
        icon: 'fa-solid fa-boxes-stacked',
        required: true,
      },
    ],
  };

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.bookService.getAll().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar los libros.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  openModal(book: Book): void {
    this.selectedBook = book;
    this.modal.open();
  }

  onModalClose(): void {
    this.selectedBook = null;
    this.apiError = '';
  }

  onSave(formData: Book): void {
    const { id, ...dto } = formData;

    this.bookService.update(id, dto).subscribe({
      next: () => {
        this.apiError = '';
        this.modal.closeModal();
        this.loadBooks();
      },
      error: (err) => {
        this.apiError = getApiError(err, 'Error al actualizar el libro.');
      },
    });
  }
}
