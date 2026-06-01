import * as cheerio from "cheerio";
import type { ParsedAgencyRow } from "../types/kmu-types.js";

export class KmuParserService {
  private readonly KMU_URL = "https://www.kmu.gov.ua";

  parseCatalog(html: string): ParsedAgencyRow[] {
    const $ = cheerio.load(html);
    const agencies: ParsedAgencyRow[] = [];

    $(".js-authority-block").each((_blockIdx, blockElement) => {
      const rawTypeName = $(blockElement).find("h2.heading-2").text().trim();

      const typeName = this.normalizeTypeName(rawTypeName);
      if (!typeName) {
        return;
      }

      $(blockElement)
        .find("li.wcag-catalog-card")
        .each((_cardIdx, cardElement) => {
          const mainLink = $(cardElement).find("a.wcag-catalog-card-name");
          const name = mainLink.text().trim();
          let website = mainLink.attr("href")?.trim() || "";

          if (website.startsWith("/")) {
            website = `${this.KMU_URL}${website}`;
          }

          if (name) {
            agencies.push({
              name,
              typeName,
              website,
            });
          }

          $(cardElement)
            .find(".slide-panel li a")
            .each((_subIdx, subLinkElement) => {
              const subName = $(subLinkElement).text().trim();
              let subWebsite = $(subLinkElement).attr("href")?.trim() || "";

              if (subWebsite.startsWith("/")) {
                subWebsite = `${this.KMU_URL}${subWebsite}`;
              }

              if (subName) {
                agencies.push({
                  name: subName,
                  typeName: `${typeName} (підпорядковані)`,
                  website: subWebsite,
                });
              }
            });
        });
    });
    return agencies;
  }

  private normalizeTypeName(rawName: string): string {
    if (!rawName) {
      return "";
    }
    if (rawName.includes("Міністерства")) {
      return "Міністерство";
    }
    if (rawName.includes("Служби")) {
      return "Державна служба";
    }
    if (rawName.includes("Агентства")) {
      return "Державне агентство";
    }
    if (rawName.includes("Інспекції")) {
      return "Державна інспекція";
    }
    if (rawName.includes("Комісії")) {
      return "Комісія";
    }
    if (rawName.includes("Бюро")) {
      return "Бюро";
    }
    if (rawName.includes("Місцеві")) {
      return "Місцеві органи влади";
    }

    return rawName.split(",")[0].trim();
  }
}
