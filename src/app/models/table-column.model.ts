export type ColumnType = 'text' | 'monetary' | 'boolean' | 'actions';

interface BaseColumn {
  type: ColumnType;
  label: string;
  accessor?: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TextColumn extends BaseColumn {
  type: 'text';
  accessor: string;
}

export interface MonetaryColumn extends BaseColumn {
  type: 'monetary';
  accessor: string;
  currency?: string;
  locale?: string;
}

export interface BooleanColumn extends BaseColumn {
  type: 'boolean';
  accessor: string;
  trueLabel?: string;
  falseLabel?: string;
}

export interface ActionsColumn extends BaseColumn {
  type: 'actions';
  actions: ActionButton<any>[];
}

export interface ActionButton<T> {
  icon: string;
  tooltip?: string;
  onClick: (row: T) => void;
}

export type TableColumn = TextColumn | MonetaryColumn | BooleanColumn | ActionsColumn;