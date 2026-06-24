export interface ParseCsvResult<T> {
  validRecords: T[];
  totalRows: number;
  skippedRows: number;
}

export type CsvTypeCastFn = (row: Record<string, string>) => Record<string, unknown>;

export type CsvScalarValue = string | number | boolean | Date | null | undefined;
