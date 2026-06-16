import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { extractRetryDelayMs, isRateLimitError } from "../../../utils/rate-limit.js";
import { sleep } from "../../../utils/sleep.js";
import type { ScrapeSelectors } from "../types/news-types.js";

const MAX_RETRIES = 1;

const scrapeSelectorsSchema = z.object({
  container: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  date: z.string(),
});

export class NewsAiAnalyzerService {
  private readonly aiClient: GoogleGenAI | null;

  constructor() {
    if (process.env.AI_API_KEY) {
      this.aiClient = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
    } else {
      this.aiClient = null;
    }
  }

  async generateSelectors(htmlSnapshot: string): Promise<ScrapeSelectors | null> {
    if (!this.aiClient) {
      throw new Error("AI features are disabled: Missing AI_API_KEY in server environment.");
    }
    return this.generateSelectorsWithRetry(htmlSnapshot, MAX_RETRIES);
  }

  private async generateSelectorsWithRetry(
    htmlSnapshot: string,
    retriesLeft: number,
  ): Promise<ScrapeSelectors | null> {
    const timestamp = new Date().toISOString();

    const bodyMatch = htmlSnapshot.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : htmlSnapshot;
    const cleanHtml = bodyHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const prompt = `
      Ти — системний робот-аналітик, який готує інструкції для веб-скраперів на Cheerio.
      Подивись на наданий HTML-код новинної сторінки державного органу.
      Знайди блоки, де відображається стрічка новин (список новин чи карток).
      
      Визнач та поверни точні CSS-селектори для наступних чотирьох елементів:
      1. "container" — селектор для однієї картки/блоку новини у списку (наприклад, "div.news-card" або "li.item").
      2. "title" — селектор для тексту заголовка всередині контейнера новини (наприклад, "h3.title" або "a.name").
      3. "url" — селектор для тегу посилання на повну новину всередині контейнера (наприклад, "a" або "h3 a").
      4. "date" — селектор для блоку з датою публікації всередині контейнера (наприклад, "span.date" або "time").

      КРИТИЧНА ВИМОГА: Поверни результат ВИКЛЮЧНО як чистий сирий JSON-об'єкт.
      Не додавай жодних пояснень, текстів, або markdown-обгорток (наприклад, коментарів чи знаків \`\`\`json).
      Формат вихідних даних має бути строго таким:
      {
        "container": "string",
        "title": "string",
        "url": "string",
        "date": "string"
      }
    `;

    try {
      console.log(
        `${timestamp} : [AI Agent] Sending HTML snapshot to Gemini for structural token analysis...`,
      );

      if (!this.aiClient) {
        throw new Error("AI features are disabled: Missing AI_API_KEY in server environment.");
      }
      const response = await this.aiClient.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [prompt, cleanHtml],
        config: {
          responseMimeType: "application/json",
        },
      });
      const responseText = response.text?.trim() || "";

      if (!responseText) {
        throw new Error("Received an empty text stream response from the AI model.");
      }

      const validation = scrapeSelectorsSchema.safeParse(JSON.parse(responseText));

      if (!validation.success) {
        console.warn(
          `${timestamp} : [AI Agent Warning] Selector discovery failed for this specific layout`,
        );
        return null;
      }

      return validation.data;
    } catch (error) {
      if (isRateLimitError(error) && retriesLeft > 0) {
        const delayMs = extractRetryDelayMs(error);
        console.warn(
          `${timestamp} : [AI Agent] 429 RESOURCE_EXHAUSTED received. ` +
            `Waiting ${delayMs}ms before retry (${retriesLeft} attempt(s) left)...`,
        );
        await sleep(delayMs);
        return this.generateSelectorsWithRetry(htmlSnapshot, retriesLeft - 1);
      }

      console.error(
        `${timestamp} : [AI Agent ERROR] Failed to evaluate DOM structure or parse JSON matrix.`,
      );
      if (error instanceof Error) {
        console.error(`=> Reason: ${error.message}`);
      }
      throw error;
    }
  }
}
