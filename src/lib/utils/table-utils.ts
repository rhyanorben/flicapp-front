/**
 * Table utility functions for export, formatting, and data manipulation
 */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR");
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("pt-BR");
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  if (data.length === 0) return;

  const csvHeaders = headers ? Object.values(headers) : Object.keys(data[0]);

  const csvRows = data.map((row) =>
    Object.values(row)
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );

  const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

export function exportToJSON<T>(data: T[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
}

export function sortData<T>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function sortByString<T>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = String(a[field]).toLowerCase();
    const bVal = String(b[field]).toLowerCase();

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function sortByNumber<T>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = Number(a[field]);
    const bVal = Number(b[field]);

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function sortByDate<T>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = new Date(a[field] as string).getTime();
    const bVal = new Date(b[field] as string).getTime();

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function paginateData<T>(
  data: T[],
  page: number,
  itemsPerPage: number
): { paginatedData: T[]; totalPages: number; totalItems: number } {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    paginatedData,
    totalPages,
    totalItems: data.length,
  };
}
