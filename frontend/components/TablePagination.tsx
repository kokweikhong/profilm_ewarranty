import { Table } from "@tanstack/react-table";

interface TablePaginationProps<T> {
  table: Table<T>;
}

export function TablePagination<T>({ table }: TablePaginationProps<T>) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <button
        className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
        <strong>{table.getPageCount()}</strong>
      </span>
      <button
        className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </button>
    </div>
  );
}
