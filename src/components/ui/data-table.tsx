import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Download,
  Filter,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  idKey?: keyof T;
  pageSize?: number;
  exportFileName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKey,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  idKey = "id" as keyof T,
  pageSize = 10,
  exportFileName = "snepr-export",
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionLabel,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtered data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKey) {
        return String(item[searchKey] || "").toLowerCase().includes(term);
      }
      return Object.values(item).some((val) =>
        String(val || "").toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchKey]);

  // 2. Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[col.accessorKey!];
      const bVal = b[col.accessorKey!];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comp = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comp : -comp;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // 3. Paginated data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(colId);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allIds = sortedData.map((d) => String(d[idKey]));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const exportToCSV = () => {
    const headers = columns.map((c) => `"${c.header}"`).join(",");
    const rows = sortedData.map((item) =>
      columns
        .map((c) => {
          const val = c.accessorKey ? item[c.accessorKey] : "";
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#EEE7DC]">
        <DataTableSkeleton rows={pageSize} cols={columns.length} />
      </div>
    );
  }

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(String(item[idKey])));

  return (
    <div className="bg-white rounded-3xl border border-[#EEE7DC] shadow-xs overflow-hidden">
      {/* Top Search & Controls Bar */}
      {(searchable || exportFileName) && (
        <div className="p-4 sm:p-5 border-b border-[#F2ECE3] flex flex-wrap items-center justify-between gap-3">
          {searchable && (
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="w-4 h-4 text-[#8C7D70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs font-sans border border-[#E0D7CB] rounded-full bg-[#FAF7F2] text-[#1C1613] outline-none focus:border-[#7A4B29] transition-colors"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="rounded-full border-[#D5CABB] text-xs font-medium text-[#4A3F35] hover:bg-[#F5EFE6] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      {paginatedData.length === 0 ? (
        <div className="p-6">
          <EmptyState
            type={searchTerm ? "no_results" : "generic"}
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2A231C]">
            <thead className="bg-[#FAF7F2] border-b border-[#EEE7DC] text-[#7A6E64] font-medium uppercase tracking-wider text-[10px]">
              <tr>
                {selectable && (
                  <th className="px-4 py-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="rounded border-[#D5CABB] text-[#7A4B29] focus:ring-[#7A4B29] cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.id}
                    onClick={() => col.sortable && handleSort(col.id)}
                    className={`px-4 py-3.5 ${
                      col.sortable ? "cursor-pointer select-none hover:text-[#1C1613]" : ""
                    } ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${
                        col.align === "right"
                          ? "justify-end"
                          : col.align === "center"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-[#A3978B]">
                          {sortColumn === col.id ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="w-3 h-3 text-[#7A4B29]" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-[#7A4B29]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {paginatedData.map((item, idx) => {
                const itemId = String(item[idKey]);
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId || idx}
                    className={`hover:bg-[#FCFAF7] transition-colors ${
                      isSelected ? "bg-[#FBF6EE]" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(itemId)}
                          className="rounded border-[#D5CABB] text-[#7A4B29] focus:ring-[#7A4B29] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-4 py-3 ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {sortedData.length > pageSize && (
        <div className="p-4 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#786D65]">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-full px-3 py-1 text-xs border-[#D8CEBF] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </Button>
            <span className="px-2 font-medium text-[#1C1613]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full px-3 py-1 text-xs border-[#D8CEBF] disabled:opacity-40 cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

