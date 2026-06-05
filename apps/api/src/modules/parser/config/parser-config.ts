import path from "node:path";

const DEFAULT_STORAGE_DIR = "storage";
const DEFAULT_HTML_FILE = "kmu_page.html";
const DEFAULT_CSV_FILE = "kmu_agencies.csv";

const storageDir = path.join(process.cwd(), process.env.KMU_STORAGE_DIR || DEFAULT_STORAGE_DIR);

export const PARSER_CONFIG = {
  htmlPath: path.join(storageDir, process.env.KMU_HTML_FILE || DEFAULT_HTML_FILE),
  csvPath: path.join(storageDir, process.env.KMU_CSV_FILE || DEFAULT_CSV_FILE),
};
