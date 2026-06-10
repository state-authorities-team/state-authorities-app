import fs from "node:fs/promises";
import path from "node:path";

type CsvScalarValue = string | number | boolean | Date | null | undefined;

const BOM = "\ufeff";

const escapeCsvValue = (value: CsvScalarValue): string => {
  const normalizedValue =
    value instanceof Date ? value.toISOString() : value == null ? "" : String(value);
  return `"${normalizedValue.replace(/"/g, '""')}"`;
};

export function buildCsvContent<T extends Record<string, CsvScalarValue>>(
  headers: readonly string[],
  data: readonly T[],
): string {
  const headerRow = headers.join(",");
  const bodyRows = data.map((row) =>
    headers.map((header) => escapeCsvValue(row[header])).join(","),
  );

  return [headerRow, ...bodyRows].join("\r\n");
}

export function buildCsvBuffer<T extends Record<string, CsvScalarValue>>(
  headers: readonly string[],
  data: readonly T[],
): Buffer {
  const csvContent = buildCsvContent(headers, data);
  return Buffer.from(`${BOM}${csvContent}`, "utf-8");
}

export async function writeToCsv<T extends Record<string, CsvScalarValue>>(
  filepath: string,
  data: readonly T[],
  headers?: readonly string[],
): Promise<void> {
  const resolvedHeaders = headers ?? (data[0] ? Object.keys(data[0]) : []);
  const csvBuffer = buildCsvBuffer(resolvedHeaders, data);

  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, csvBuffer);
}
