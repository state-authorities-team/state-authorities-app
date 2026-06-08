import puppeteer from "puppeteer";
import { puppeteerConfig } from "../config/puppeteer-config.js";

export class KmuScraperService {
  constructor(private readonly targetUrl: string = "https://www.kmu.gov.ua/catalog") {}

  private logErrorDetails(error: unknown): void {
    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    } else {
      console.error(`=> Reason: Unknown error occurred`, error);
    }
  }

  async fetchCatalogHtml(): Promise<string> {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} : [Parser][ScrapperService] Launching headless browser...`);

    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();

    try {
      console.log(`${timestamp} : [Parser][ScrapperService] Navigating to live URL...`);
      await page.goto(this.targetUrl, { waitUntil: "networkidle2" });

      const blockSelector = "div.js-authority-block";
      await page.waitForSelector(blockSelector, { timeout: 15000 });

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
