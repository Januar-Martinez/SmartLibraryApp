import { Member } from './../../models/member.model';
import { MemberService } from './../../services/member.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TableComponent } from '../../shared/table/table.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableColumn } from '../../models/table-column.model';
import { ModalConfig } from '../../models/modal-field.model';
import { getApiError } from '../../core/api-error.util';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent, ModalComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private memberService = inject(MemberService);
  private cdr = inject(ChangeDetectorRef);
  apiError = '';

  @ViewChild('modal') modal!: ModalComponent;

  members: Member[] = [];
  selectedMember: Member | null = null;
  isLoading = false;
  errorMsg = '';

  message = '';
  messageType: 'success' | 'error' | '' = '';

  isExpanded = false;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
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
      await firstValueFrom(this.memberService.create(this.form.getRawValue()));

      this.message = 'Miembro registrado correctamente.';
      this.messageType = 'success';
      this.cdr.detectChanges();

      this.form.reset();
      this.loadMembers();
    } catch (err) {
      this.message = getApiError(err, 'No fue posible registrar el miembro.');
      this.messageType = 'error';
      this.cdr.detectChanges();
    }
  }

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Miembro', accessor: 'name' },
    { type: 'text', label: 'Email', accessor: 'email' },
    { type: 'boolean', label: 'Activo', accessor: 'isActive' },
    {
      type: 'actions',
      label: 'actualizar',
      actions: [
        {
          icon: 'fa-solid fa-pencil',
          tooltip: 'Actualizar',
          onClick: (row: Member) => this.openModal(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'guestModal',
    title: 'Editar Miembro',
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
        key: 'name',
        label: 'Nombre',
        icon: 'fa-solid fa-user',
        required: true,
      },
      {
        type: 'text',
        key: 'email',
        label: 'Email',
        icon: 'fa-solid fa-envelope',
        required: true,
      },
      {
        key: 'isActive',
        type: 'boolean',
        label: 'Estado',
      },
    ],
  };

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.memberService.getAll().subscribe({
      next: (data) => {
        this.members = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar los miembros.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  openModal(member: Member): void {
    this.selectedMember = member;
    this.modal.open();
  }

  onModalClose(): void {
    this.selectedMember = null;
    this.apiError = '';
  }

  onSave(formData: Member): void {
    const { id, ...dto } = formData;

    this.memberService.update(id, dto).subscribe({
      next: () => {
        this.apiError = '';
        this.modal.closeModal();
        this.loadMembers();
      },
      error: (err) => {
        this.apiError = getApiError(err, 'Error al actualizar el miembro.');
      },
    });
  }
}
