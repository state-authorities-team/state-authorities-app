import fs from "node:fs/promises";
import path from "node:path";

type CsvScalarValue = string | number | boolean | null | undefined;

export async function writeToCsv<T extends Record<string, CsvScalarValue>>(
  filepath: string,
  data: T[],
): Promise<void> {
  if (data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]).join(",");

  const rows = data.map((obj) =>
    Object.values(obj)
      .map((val) => {
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(","),
  );
  const csvContent = [headers, ...rows].join("\n");
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, csvContent, "utf-8");
}
