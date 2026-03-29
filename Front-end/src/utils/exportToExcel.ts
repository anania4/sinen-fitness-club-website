import * as XLSX from 'xlsx';

interface ColumnConfig {
  header: string;
  key: string;
  transform?: (value: any) => any;
}

export function exportToExcel(
  data: any[],
  columns: ColumnConfig[],
  filename: string
) {
  // Build header row
  const headers = columns.map(c => c.header);

  // Build data rows
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      return col.transform ? col.transform(value) : (value ?? '');
    })
  );

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Auto-size columns
  ws['!cols'] = columns.map((col, i) => {
    const maxLen = Math.max(
      col.header.length,
      ...rows.map(r => String(r[i] ?? '').length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });

  // Create workbook and trigger download
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
