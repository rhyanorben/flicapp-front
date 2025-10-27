"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ModernTable,
  ModernTableRow,
  ModernTableHeader,
  ModernTableCell,
} from "@/components/ui/modern-table";
import { TableControls } from "@/components/ui/table-controls";
import { TablePagination } from "@/components/ui/table-pagination";
import { DetailModal } from "@/components/ui/detail-modal";
import {
  exportToCSV,
  exportToJSON,
  formatCurrency,
  formatDate,
  paginateData,
} from "@/lib/utils/table-utils";
import { cn } from "@/lib/utils";

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface TableAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (row: Record<string, unknown>) => void;
  variant?: "default" | "destructive" | "success";
  disabled?: (row: Record<string, unknown>) => boolean;
  show?: (row: Record<string, unknown>) => boolean;
}

export interface GenericTableProps {
  title?: string;
  icon?: React.ReactNode;
  data: Record<string, unknown>[];
  columns: TableColumn[];
  actions?: TableAction[];
  searchPlaceholder?: string;
  sortOptions?: { value: string; label: string }[];
  filterOptions?: { value: string; label: string }[];
  onSearch?: (term: string) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;
  onFilter?: (value: string) => void;
  onExportCSV?: () => void;
  onExportJSON?: () => void;
  detailModalContent?: (row: Record<string, unknown>) => React.ReactNode;
  onRowClick?: (row: Record<string, unknown>) => void;
  className?: string;
}

export function GenericTable({
  title,
  icon,
  data,
  columns,
  actions = [],
  searchPlaceholder = "Buscar...",
  sortOptions = [],
  filterOptions = [],
  onSearch,
  onSort,
  onFilter,
  onExportCSV,
  onExportJSON,
  detailModalContent,
  onRowClick,
  className = "",
}: GenericTableProps) {
  // Ações padrão para todas as tabelas
  const defaultActions: TableAction[] = [
    {
      id: "view",
      label: "Ver Detalhes",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      onClick: (row) => {
        console.log("Ver detalhes:", row);
        // Implementar lógica de visualização
      },
    },
    {
      id: "edit",
      label: "Editar",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: (row) => {
        console.log("Editar:", row);
        // Implementar lógica de edição
      },
    },
    {
      id: "delete",
      label: "Excluir",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: (row) => {
        console.log("Excluir:", row);
        // Implementar lógica de exclusão
      },
      variant: "destructive",
    },
  ];

  // Usar ações customizadas se fornecidas, caso contrário usar ações padrão
  const allActions = actions.length > 0 ? actions : defaultActions;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedRowDetail, setSelectedRowDetail] = useState<Record<
    string,
    unknown
  > | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Generate grid columns based on table structure
  const gridColumns = useMemo(() => {
    const checkboxColumn = "40px";
    const dataColumns = columns
      .map((col) => {
        if (col.width) return col.width;
        // Balanced approach: fixed widths for specific columns, flexible for others
        if (col.key.includes("id")) return "120px";
        if (col.key.includes("status")) return "120px";
        if (col.key.includes("data") || col.key.includes("date"))
          return "140px";
        if (col.key.includes("valor") || col.key.includes("price"))
          return "100px";
        if (col.key.includes("avaliacao")) return "100px";
        if (col.key.includes("descricao") || col.key.includes("description"))
          return "250px";
        return "1fr"; // Flexible width for other columns
      })
      .join(" ");
    return `${checkboxColumn} ${dataColumns}`.trim();
  }, [columns]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Apply sorting
    if (sortField) {
      const column = columns.find((col) => col.key === sortField);
      if (column) {
        filtered.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];

          if (column.key.includes("date") || column.key.includes("data")) {
            const aDate = new Date(String(aVal)).getTime();
            const bDate = new Date(String(bVal)).getTime();
            return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
          }

          const aStr = String(aVal).toLowerCase();
          const bStr = String(bVal).toLowerCase();
          if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
          if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  }, [data, searchTerm, sortField, sortOrder, columns]);

  // Paginate data
  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    return paginateData(filteredAndSortedData, currentPage, ITEMS_PER_PAGE);
  }, [filteredAndSortedData, currentPage]);

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    onSearch?.(term);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
    onSort?.(field, sortOrder);
  };

  const handleFilter = (value: string) => {
    setCurrentPage(1);
    onFilter?.(value);
  };

  const handleSelectRow = (rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => String(row.id)));
    }
  };

  const handleViewDetails = (row: Record<string, unknown>) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      setSelectedRowDetail(row);
    }
  };

  const handleExportCSV = () => {
    const headers = columns.reduce((acc, col) => {
      acc[col.key] = col.label;
      return acc;
    }, {} as Record<string, string>);

    exportToCSV(
      filteredAndSortedData,
      (title || "dados").toLowerCase().replace(/\s+/g, "-"),
      headers
    );
    onExportCSV?.();
  };

  const handleExportJSON = () => {
    exportToJSON(
      filteredAndSortedData,
      (title || "dados").toLowerCase().replace(/\s+/g, "-")
    );
    onExportJSON?.();
  };

  // Get status badge for status columns
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aguardando: { variant: "secondary" as const, label: "Aguardando" },
      em_andamento: { variant: "default" as const, label: "Em Andamento" },
      concluido: { variant: "default" as const, label: "Concluído" },
      cancelado: { variant: "destructive" as const, label: "Cancelado" },
      pendente: { variant: "secondary" as const, label: "Pendente" },
      aceita: { variant: "default" as const, label: "Aceita" },
      rejeitada: { variant: "destructive" as const, label: "Rejeitada" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      label: status,
    };

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className={cn("min-h-[800px] flex flex-col", className)}>
      {title && (
        <div className="flex-shrink-0 p-6 pb-0">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            {icon}
            {title}
          </h2>
        </div>
      )}
      <div className="flex flex-col flex-1 min-h-0 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <TableControls
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            searchPlaceholder={searchPlaceholder}
            sortOptions={sortOptions}
            filterOptions={filterOptions}
            onSortChange={handleSort}
            onFilterChange={handleFilter}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
          />
        </div>

        {/* Barra de ações para linhas selecionadas - ACIMA da tabela */}
        {selectedRows.length > 0 && (
          <div className="mb-4 p-4 bg-muted/30 border border-border/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedRows.length} item(s) selecionado(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {allActions
                  .filter((action) => {
                    const selectedItems = paginatedData.filter((row) =>
                      selectedRows.includes(String(row.id))
                    );

                    // Lógica contextual baseada no número de seleções
                    if (selectedRows.length === 1) {
                      // Para uma seleção: mostrar todas as ações que fazem sentido
                      return (
                        !action.show ||
                        selectedItems.some((item) => action.show?.(item))
                      );
                    } else {
                      // Para múltiplas seleções: filtrar ações que fazem sentido em lote
                      const isBulkAction =
                        action.id === "edit" ||
                        action.id === "delete" ||
                        action.id === "accept" ||
                        action.id === "reject" ||
                        action.id === "rate";

                      // Não mostrar ações de visualização para múltiplas seleções
                      const isViewAction =
                        action.id === "view" ||
                        action.id === "view-rating" ||
                        action.id === "contact";

                      if (isViewAction) return false;

                      return (
                        isBulkAction &&
                        (!action.show ||
                          selectedItems.some((item) => action.show?.(item)))
                      );
                    }
                  })
                  .map((action) => {
                    const selectedItems = paginatedData.filter((row) =>
                      selectedRows.includes(String(row.id))
                    );

                    // Ajustar label para múltiplas seleções
                    const getActionLabel = () => {
                      if (selectedRows.length > 1) {
                        switch (action.id) {
                          case "edit":
                            return `Editar ${selectedRows.length} itens`;
                          case "delete":
                            return `Excluir ${selectedRows.length} itens`;
                          case "accept":
                            return `Aceitar ${selectedRows.length} solicitações`;
                          case "reject":
                            return `Rejeitar ${selectedRows.length} solicitações`;
                          case "rate":
                            return `Avaliar ${selectedRows.length} serviços`;
                          default:
                            return action.label;
                        }
                      }
                      return action.label;
                    };

                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          selectedItems.forEach((item) => action.onClick(item));
                          setSelectedRows([]); // Limpar seleção após ação
                        }}
                        className={cn(
                          "px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2",
                          action.variant === "destructive" &&
                            "bg-red-500 text-white hover:bg-red-600",
                          action.variant === "success" &&
                            "bg-green-500 text-white hover:bg-green-600",
                          !action.variant &&
                            "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        <action.icon className="h-4 w-4" />
                        {getActionLabel()}
                      </button>
                    );
                  })}
                <button
                  onClick={() => setSelectedRows([])}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-[600px] flex flex-col">
          <ModernTable useGridLayout={true} gridColumns={gridColumns}>
            <ModernTableHeader gridColumns={gridColumns}>
              <div className="flex items-center justify-center border-r border-border/20 pr-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border/40 cursor-pointer"
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.length === paginatedData.length
                  }
                  onChange={handleSelectAll}
                />
              </div>
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center gap-1.5 border-r border-border/20 px-3"
                >
                  <span className="text-xs font-medium text-muted-foreground/60">
                    {column.label}
                  </span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="opacity-40 hover:opacity-100 transition-opacity"
                    >
                      {/* <span className="text-xs">↕️</span> */}
                    </button>
                  )}
                </div>
              ))}
            </ModernTableHeader>

            {paginatedData.map((row) => (
              <ModernTableRow
                key={String(row.id)}
                isSelected={selectedRows.includes(String(row.id))}
                onClick={() => handleViewDetails(row)}
                gridColumns={gridColumns}
              >
                <ModernTableCell borderRight={true}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border/40 cursor-pointer"
                    checked={selectedRows.includes(String(row.id))}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(String(row.id));
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </ModernTableCell>
                {columns.map((column) => (
                  <ModernTableCell key={column.key} borderRight={true}>
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key.includes("status") ? (
                      getStatusBadge(String(row[column.key]))
                    ) : column.key.includes("date") ||
                      column.key.includes("data") ? (
                      formatDate(String(row[column.key]))
                    ) : column.key.includes("valor") ||
                      column.key.includes("price") ? (
                      formatCurrency(Number(row[column.key]))
                    ) : (
                      <span className="text-sm text-foreground">
                        {String(row[column.key] || "-")}
                      </span>
                    )}
                  </ModernTableCell>
                ))}
              </ModernTableRow>
            ))}
          </ModernTable>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum item encontrado com os filtros aplicados.
          </div>
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </div>

      {detailModalContent && (
        <DetailModal
          isOpen={!!selectedRowDetail}
          onClose={() => setSelectedRowDetail(null)}
          title={`Detalhes do ${(title || "item").slice(0, -1)}`}
        >
          {selectedRowDetail && detailModalContent(selectedRowDetail)}
        </DetailModal>
      )}
    </div>
  );
}
