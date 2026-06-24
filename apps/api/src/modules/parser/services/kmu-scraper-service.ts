import puppeteer from "puppeteer";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import { puppeteerConfig } from "../config/puppeteer-config.js";

const logger = baseLogger.child({ service: "KmuScrapperService" });

export class KmuScraperService {
  async fetchCatalogHtml(url: string): Promise<string> {
    logger.debug("Launching headless browser...");

    let targetUrl = url.trim();
    try {
      const parsed = new URL(
        targetUrl.match(/^[a-zA-Z]+:\/\//) ? targetUrl : `https://${targetUrl}`,
      );
      if (parsed.protocol === "http:") {
        parsed.protocol = "https:";
      }
      targetUrl = parsed.toString();
    } catch (_e) {
      targetUrl = targetUrl.replace(/^http:\/\//i, "https://");
    }

    const browser = await puppeteer.launch(puppeteerConfig);

    try {
      const page = await browser.newPage();
      logger.debug("Navigating to live URL...");

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
            logger.warn(
              "Navigation encountered ERR_BLOCKED_BY_CLIENT but page content is non-empty. Proceeding...",
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

      logger.debug("Extracting raw HTML source code...");
      const html = await page.content();

      return html;
    } catch (error) {
      logger.warn("Failed to fetch live HTML string!");
      logger.debug(error);
      throw error;
    } finally {
      await browser.close();
      logger.debug("Browser resources cleared.");
    }
  }
}
