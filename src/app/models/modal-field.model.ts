export type FieldType = 'text' | 'number' | 'select' | 'date' | 'boolean';

export interface SelectOption {
  label: string;
  value: any;
}

interface BaseField {
  type: FieldType;
  key: string;
  label: string;
  icon?: string;
  required?: boolean;
  visible?: boolean;
  readonly?: boolean;
}

export interface TextField extends BaseField {
  type: 'text';
  uppercase?: boolean;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: SelectOption[];
}

export interface DateField extends BaseField {
  type: 'date';
  min?: string;
  max?: string;
}

export interface BooleanField extends BaseField {
  type: 'boolean';
  trueLabel?: string;
  falseLabel?: string;
}

export type ModalField =
  TextField | NumberField | SelectField | DateField | BooleanField;

export interface ModalConfig {
  modalId: string;
  title: string;
  fields: ModalField[];
}
