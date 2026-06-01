import fs from "node:fs/promises";
import path from "node:path";

export class KmuScraperService {
  async fetchCatalogHtml(): Promise<string> {
    try {
      console.log(`${new Date().toISOString()} : Reading local copy of KMU html page...`);

      const localFilePath = path.join(process.cwd(), "storage", "kmu_page.html");
      const html = await fs.readFile(localFilePath, "utf-8");

      return html;
    } catch (error) {
      console.error(
        `${new Date().toISOString()} : Can't read local HTML-file. Check if file location is  storage/kmu_page.html`,
      );
      throw error;
    }
  }
}
