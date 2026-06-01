import fs from "node:fs/promises";

export class KmuScraperService {
  constructor(private readonly htmlPath: string) {}

  private logErrorDetails(error: unknown): void {
    if (error && typeof error === "object" && "code" in error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        console.error(
          `=> System Code: ENOENT (Entity Not Found). The file storage chain is broken.`,
        );
      } else if (nodeError.code === "EACCES") {
        console.error(`=> System Code: EACCES (Permission Denied). Read permissions are missing.`);
      }
    }

    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    } else {
      console.error(`=> Reason: Unknown error occurred`, error);
    }
  }

  async fetchCatalogHtml(): Promise<string> {
    const timestamp = new Date().toISOString();
    try {
      try {
        await fs.access(this.htmlPath);
      } catch {
        throw new Error(
          `File does not exist or is inaccessible at path: "${this.htmlPath}". Please follow the README instructions to create it.`,
        );
      }
      console.log(
        `${timestamp} : [Parser][ScrapperService] Reading local copy of KMU html page...`,
      );

      const html = await fs.readFile(this.htmlPath, "utf-8");
      if (!html || html.trim().length === 0) {
        throw new Error(
          `The HTML file at "${this.htmlPath}" is empty. Please paste the copied KMU catalog source code inside.`,
        );
      }

      return html;
    } catch (error) {
      console.error(`${timestamp} : [Scraper ERROR] Failed to extract HTML source!`);
      this.logErrorDetails(error);
      throw error;
    }
  }
}
