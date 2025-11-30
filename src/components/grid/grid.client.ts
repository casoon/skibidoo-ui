// Grid Client Controller - Hydration Logic
import type { GridState } from "../../types/index.js";

export interface GridControllerOptions {
  onSort?: (field: string, direction: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  onSelectionChange?: (selectedKeys: string[]) => void;
  onFilter?: (filters: Record<string, unknown>) => void;
  fetchData?: (state: GridState) => Promise<string>;
}

export class GridController {
  private el: HTMLElement;
  private props: Record<string, unknown>;
  private state: GridState;
  private options: GridControllerOptions;

  constructor(el: HTMLElement, props: Record<string, unknown>, options: GridControllerOptions = {}) {
    this.el = el;
    this.props = props;
    this.options = options;
    this.state = {
      currentPage: 1,
      pageSize: (props.pageSize as number) || 10,
      sortField: null,
      sortDirection: "asc",
      filters: {},
      selectedRows: [],
    };
  }

  init(): void {
    this.bindSorting();
    this.bindPagination();
    this.bindSelection();
    this.bindSearch();
    this.setupKeyboardNavigation();

    this.emit("init", { state: this.state });
  }

  private bindSorting(): void {
    const headers = this.el.querySelectorAll(".ui-grid__header--sortable");
    headers.forEach((header) => {
      header.addEventListener("click", (e) => {
        const field = (e.currentTarget as HTMLElement).dataset.field;
        if (field) this.sort(field);
      });
    });
  }

  private bindPagination(): void {
    const actions: Record<string, () => void> = {
      first: () => this.goToPage(1),
      prev: () => this.goToPage(this.state.currentPage - 1),
      next: () => this.goToPage(this.state.currentPage + 1),
      last: () => this.goToPage(this.getTotalPages()),
    };

    Object.entries(actions).forEach(([action, handler]) => {
      const btn = this.el.querySelector(`[data-action="${action}"]`);
      btn?.addEventListener("click", handler);
    });
  }

  private bindSelection(): void {
    const selectAll = this.el.querySelector(".ui-grid__checkbox-all");
    selectAll?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.selectAll(checked);
    });

    this.el.addEventListener("change", (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('[data-action="select-row"]')) {
        const row = target.closest(".ui-grid__row");
        const key = row?.getAttribute("data-row-key");
        if (key) this.toggleRowSelection(key);
      }
    });
  }

  private bindSearch(): void {
    const searchInput = this.el.querySelector(".ui-grid__search");
    let debounceTimer: ReturnType<typeof setTimeout>;

    searchInput?.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const value = (e.target as HTMLInputElement).value;
        this.filter({ search: value });
      }, 300);
    });
  }

  private setupKeyboardNavigation(): void {
    this.el.addEventListener("keydown", (e) => {
      const key = e.key;
      const rows = this.el.querySelectorAll(".ui-grid__row:not(.ui-grid__row--empty)");
      const focusedRow = document.activeElement?.closest(".ui-grid__row");

      if (!focusedRow) return;

      const currentIndex = Array.from(rows).indexOf(focusedRow);

      if (key === "ArrowDown" && currentIndex < rows.length - 1) {
        e.preventDefault();
        (rows[currentIndex + 1] as HTMLElement).focus();
      } else if (key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        (rows[currentIndex - 1] as HTMLElement).focus();
      }
    });

    // Make rows focusable
    this.el.querySelectorAll(".ui-grid__row").forEach((row) => {
      row.setAttribute("tabindex", "0");
    });
  }

  sort(field: string): void {
    if (this.state.sortField === field) {
      this.state.sortDirection = this.state.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField = field;
      this.state.sortDirection = "asc";
    }

    this.updateSortIndicators();
    this.options.onSort?.(field, this.state.sortDirection);
    this.emit("sort", { field, direction: this.state.sortDirection });
    this.refresh();
  }

  private updateSortIndicators(): void {
    this.el.querySelectorAll(".ui-grid__sort-icon").forEach((icon) => {
      icon.setAttribute("data-sort", "none");
    });

    if (this.state.sortField) {
      const activeHeader = this.el.querySelector(`[data-field="${this.state.sortField}"] .ui-grid__sort-icon`);
      activeHeader?.setAttribute("data-sort", this.state.sortDirection);
    }
  }

  goToPage(page: number): void {
    const totalPages = this.getTotalPages();
    const newPage = Math.max(1, Math.min(page, totalPages));

    if (newPage !== this.state.currentPage) {
      this.state.currentPage = newPage;
      this.updatePaginationUI();
      this.options.onPageChange?.(newPage);
      this.emit("pageChange", { page: newPage });
      this.refresh();
    }
  }

  private getTotalPages(): number {
    const totalEl = this.el.querySelector("[data-page-total]");
    return parseInt(totalEl?.textContent || "1", 10);
  }

  private updatePaginationUI(): void {
    const currentEl = this.el.querySelector("[data-page-current]");
    if (currentEl) currentEl.textContent = String(this.state.currentPage);

    const totalPages = this.getTotalPages();
    const btns = {
      first: this.el.querySelector('[data-action="first"]') as HTMLButtonElement,
      prev: this.el.querySelector('[data-action="prev"]') as HTMLButtonElement,
      next: this.el.querySelector('[data-action="next"]') as HTMLButtonElement,
      last: this.el.querySelector('[data-action="last"]') as HTMLButtonElement,
    };

    if (btns.first) btns.first.disabled = this.state.currentPage <= 1;
    if (btns.prev) btns.prev.disabled = this.state.currentPage <= 1;
    if (btns.next) btns.next.disabled = this.state.currentPage >= totalPages;
    if (btns.last) btns.last.disabled = this.state.currentPage >= totalPages;
  }

  selectAll(checked: boolean): void {
    const rows = this.el.querySelectorAll(".ui-grid__row:not(.ui-grid__row--empty)");
    this.state.selectedRows = [];

    rows.forEach((row) => {
      const checkbox = row.querySelector(".ui-grid__checkbox") as HTMLInputElement;
      const key = row.getAttribute("data-row-key");

      if (checkbox) checkbox.checked = checked;
      row.classList.toggle("ui-grid__row--selected", checked);

      if (checked && key) {
        this.state.selectedRows.push(key);
      }
    });

    this.options.onSelectionChange?.(this.state.selectedRows);
    this.emit("selectionChange", { selected: this.state.selectedRows });
  }

  toggleRowSelection(key: string): void {
    const index = this.state.selectedRows.indexOf(key);
    const row = this.el.querySelector(`[data-row-key="${key}"]`);

    if (index === -1) {
      if (this.props.selection === "single") {
        this.state.selectedRows = [key];
        this.el.querySelectorAll(".ui-grid__row--selected").forEach((r) => {
          r.classList.remove("ui-grid__row--selected");
        });
      } else {
        this.state.selectedRows.push(key);
      }
      row?.classList.add("ui-grid__row--selected");
    } else {
      this.state.selectedRows.splice(index, 1);
      row?.classList.remove("ui-grid__row--selected");
    }

    this.options.onSelectionChange?.(this.state.selectedRows);
    this.emit("selectionChange", { selected: this.state.selectedRows });
  }

  filter(filters: Record<string, unknown>): void {
    this.state.filters = { ...this.state.filters, ...filters };
    this.state.currentPage = 1;
    this.options.onFilter?.(this.state.filters);
    this.emit("filter", { filters: this.state.filters });
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (this.options.fetchData) {
      this.el.classList.add("ui-grid--loading");

      try {
        const html = await this.options.fetchData(this.state);
        const tbody = this.el.querySelector(".ui-grid__body");
        if (tbody) tbody.innerHTML = html;
      } finally {
        this.el.classList.remove("ui-grid--loading");
      }
    }

    this.emit("refresh", { state: this.state });
  }

  getState(): GridState {
    return { ...this.state };
  }

  getSelectedRows(): string[] {
    return [...this.state.selectedRows];
  }

  private emit(event: string, detail: Record<string, unknown>): void {
    this.el.dispatchEvent(
      new CustomEvent(`grid:${event}`, {
        detail,
        bubbles: true,
      })
    );
  }

  destroy(): void {
    this.emit("destroy", {});
  }
}
