import { Readable } from "node:stream";
import { parse } from "csv-parse";
import { type ZodType, z } from "zod";
import type { CsvTypeCastFn, ParseCsvResult } from "../types/csv-parser-types.js";

export const parseAndValidate = async <T>(
  fileBuffer: Buffer,
  schema: ZodType<T>,
  typeCastFn?: CsvTypeCastFn,
): Promise<ParseCsvResult<T>> => {
  const validRecords: T[] = [];
  let skippedRows = 0;
  let totalRows = 0;

  const stream = Readable.from(fileBuffer).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );
  for await (const row of stream) {
    totalRows++;

    const preparedRow = typeCastFn ? typeCastFn(row) : row;
    const validation = schema.safeParse(preparedRow);

    if (!validation.success) {
      const formattedError = z.treeifyError(validation.error);
      console.warn(
        `${new Date().toISOString} [CSV Parser] Row ${totalRows} was skipped`,
        formattedError,
      );
      skippedRows++;
      continue;
    }
    validRecords.push(validation.data);
  }
  return {
    validRecords,
    skippedRows,
    totalRows,
  };
};
