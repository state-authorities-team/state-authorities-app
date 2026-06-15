import puppeteer from "puppeteer";
import { puppeteerConfig } from "../config/puppeteer-config.js";

export class KmuScraperService {
  private logErrorDetails(error: unknown): void {
    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    } else {
      console.error(`=> Reason: Unknown error occurred`, error);
    }
  }

  async fetchCatalogHtml(url: string): Promise<string> {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} : [Parser][ScrapperService] Launching headless browser...`);

    const targetUrl = url.startsWith("http://") 
      ? url.replace("http://", "https://") 
      : url;

    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();

    try {
      console.log(`${timestamp} : [Parser][ScrapperService] Navigating to live URL...`);

      await page.setExtraHTTPHeaders({
        "Upgrade-Insecure-Requests": "1",
      });

      try {
        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
      } catch (gotoError) {
        const isBlockedByClient =
          gotoError instanceof Error && gotoError.message.includes("ERR_BLOCKED_BY_CLIENT");
        if (isBlockedByClient) {
          const html = await page.content();
          if (html && html.trim().length > 0) {
            console.warn(
              `${timestamp} : [Parser][ScrapperService] Warning: Navigation encountered ERR_BLOCKED_BY_CLIENT but page content is non-empty. Proceeding...`,
            );
          } else {
            throw gotoError;
          }
        } else {
          throw gotoError;
        }
      }

      await page.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      console.log(`${timestamp} : [Parser][ScrapperService] Extracting raw HTML source code...`);
      const html = await page.content();

      return html;
    } catch (error) {
      console.error(`${timestamp} : [Scraper ERROR] Failed to fetch live HTML string!`);
      this.logErrorDetails(error);
      throw error;
    } finally {
      await browser.close();
      console.log(`${timestamp} : [Parser][ScrapperService] Browser resources cleared.`);
    }
  }
}
