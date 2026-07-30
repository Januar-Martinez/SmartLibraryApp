export type ColumnType = 'text' | 'monetary' | 'boolean' | 'actions' | 'date';

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
  disabled?:(row:T)=>boolean;
  onClick: (row: T) => void;
}

export interface DateColumn extends BaseColumn {
  type: 'date';
  accessor: string;
}

export type TableColumn = TextColumn | MonetaryColumn | BooleanColumn | ActionsColumn | DateColumn;