import { Readable } from "node:stream";
import { type Options, parse } from "csv-parse";
import type { ZodType } from "zod";
import { logger as baseLogger } from "../configs/logger-config.js";
import type { CsvTypeCastFn, ParseCsvResult } from "../types/csv-parser-types.js";

const logger = baseLogger.child({ service: "CsvParser" });

const csvParseOptions: Options = {
  bom: true,
  delimiter: [",", ";"],
  columns: true,
  encoding: "utf8",
  record_delimiter: ["\r\n", "\n"],
  skip_empty_lines: true,
  trim: true,
};

export const parseAndValidate = async <T>(
  fileBuffer: Buffer,
  schema: ZodType<T>,
  typeCastFn?: CsvTypeCastFn,
): Promise<ParseCsvResult<T>> => {
  const validRecords: T[] = [];
  let skippedRows = 0;
  let totalRows = 0;

  const parserStream = parse(csvParseOptions);
  Readable.from(fileBuffer).pipe(parserStream);

  for await (const row of parserStream) {
    totalRows++;

    const preparedRow = typeCastFn ? typeCastFn(row) : row;
    const validation = schema.safeParse(preparedRow);

    if (!validation.success) {
      const formattedError = validation.error.format();

      logger.warn(`Row ${totalRows} was skipped`, formattedError);
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
