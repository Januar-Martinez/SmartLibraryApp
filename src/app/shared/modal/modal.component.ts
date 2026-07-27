import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalConfig, ModalField, SelectField, TextField } from '../../models/modal-field.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnChanges {
  @Input({ required: true }) config!: ModalConfig;

  @Input() editData: any | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  @Input() apiError = '';

  formData: Record<string, any> = {};
  isOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData']) {
      this.buildForm();
    }
  }

  open(): void {
    this.buildForm();
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }

  private buildForm(): void {
    this.formData = {};

    for (const field of this.config.fields) {
      this.formData[field.key] = this.editData?.[field.key] ?? '';
    }
  }

  isFieldVisible(field: ModalField): boolean {
    return field.visible !== false;
  }

  asSelect(field: ModalField): SelectField {
    return field as SelectField;
  }

  asText(field: ModalField): TextField {
    return field as TextField;
  }

  onSave(): void {
    if (!this.validate()) return;
    this.save.emit(this.formData);
  }

  errors: Record<string, string> = {};

  private validate(): boolean {
    this.errors = {};
    for (const field of this.config.fields) {
      if (!this.isFieldVisible(field)) continue;
      if (field.required === false) continue;

      const val = this.formData[field.key];
      const isEmpty = val === '' || val === null || val === undefined;
      const isZero = field.type === 'number' && Number(val) === 0;

      if (isEmpty || isZero) {
        this.errors[field.key] = `${field.label} es requerido`;
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  onTextInput(field: ModalField, event: Event): void {
    const textField = this.asText(field);
    if (textField.uppercase) {
      const input = event.target as HTMLInputElement;
      this.formData[field.key] = input.value.toUpperCase();
    }
  }
}
