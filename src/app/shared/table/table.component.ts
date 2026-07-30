import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TableColumn,
  MonetaryColumn,
  BooleanColumn,
  ActionsColumn,
} from '../../models/table-column.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input({ required: true }) columns: TableColumn[] = [];

  private _data = signal<any[]>([]);
  filters = signal<Record<string, string>>({});
  sortColumn = signal<string>('');
  sortAsc = signal<boolean>(true);
  currentPage = signal<number>(0);
  pageSize = signal<number>(5);
  showFooterFor = signal<Record<string, boolean>>({});

  readonly pageSizeOptions = [5, 10, 20];

  @Input({ required: true })
  set data(value: any[]) {
    this._data.set(value ?? []);
    this.currentPage.set(0);
  }

  filteredData = computed(() => {
    let result = [...this._data()];
    const filters = this.filters();

    for (const key in filters) {
      const val = filters[key]?.toLowerCase().trim();
      if (!val) continue;

      result = result.filter((row) =>
        String(row[key] ?? '')
          .toLowerCase()
          .includes(val),
      );
    }

    const sortCol = this.sortColumn();
    if (sortCol) {
      result.sort((a, b) => {
        const aVal = a[sortCol];
        const bVal = b[sortCol];
        return this.sortAsc() ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  });

  pagedData = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredData().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.pageSize()));

  onFilterChange(accessor: string, value: string) {
    this.filters.update((f) => ({ ...f, [accessor]: value }));
    this.currentPage.set(0);
  }

  onSort(accessor?: string) {
    if (!accessor) return;

    if (this.sortColumn() === accessor) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortColumn.set(accessor);
      this.sortAsc.set(true);
    }
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  toggleFooter(accessor: string) {
    this.showFooterFor.update((f) => ({
      ...f,
      [accessor]: !f[accessor],
    }));
  }

  asMonetary(col: TableColumn): MonetaryColumn {
    return col as MonetaryColumn;
  }

  asBoolean(col: TableColumn): BooleanColumn {
    return col as BooleanColumn;
  }

  asActions(col: TableColumn): ActionsColumn {
    return col as ActionsColumn;
  }

  formatMonetary(value: number, col: MonetaryColumn): string {
    return new Intl.NumberFormat(col.locale ?? 'es-CO', {
      style: 'currency',
      currency: col.currency ?? 'COP',
    }).format(value);
  }

  formatBoolean(value: boolean, col: BooleanColumn): string {
    return value ? 'Sí' : 'No';
  }

  formatDate(value: string) {
    if (!value) return 'Sin devolución';

    return new Date(value).toLocaleDateString('es-CO');
  }

  formatStatus(status: string) {
    switch (status) {
      case 'Active':
        return 'Activo';

      case 'Returned':
        return 'Devuelto';

      case 'Overdue':
        return 'Vencido';

      default:
        return status;
    }
  }

  getFooterSum(accessor: string): number {
    return this.filteredData().reduce((sum, row) => sum + (row[accessor] ?? 0), 0);
  }
}
