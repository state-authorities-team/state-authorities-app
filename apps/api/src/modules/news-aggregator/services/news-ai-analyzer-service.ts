import { GoogleGenAI } from "@google/genai";
import type { ScrapeSelectors } from "../types/news-types.js";

export class NewsAiAnalyzerService {
  private readonly ai: GoogleGenAI;

  constructor() {
    if (!process.env.AI_API_KEY) {
      throw new Error("[NewsAiAnalyzerService] AI_API_KEY is not configured.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
  }

  generateSelectors = async (htmlSnapshot: string): Promise<ScrapeSelectors> => {
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

      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [prompt, cleanHtml],
      });
      const responseText = response.text?.trim() || "";

      if (!responseText) {
        throw new Error("Received an empty text stream response from the AI model.");
      }

      const parsedSelectors = JSON.parse(responseText) as ScrapeSelectors;

      if (!parsedSelectors.container || !parsedSelectors.title || !parsedSelectors.url) {
        throw new Error("AI response format validation failed. Some core CSS targets are missing.");
      }

      return parsedSelectors;
    } catch (error) {
      console.error(
        `${timestamp} : [AI Agent ERROR] Failed to evaluate DOM structure or parse JSON matrix.`,
      );

      if (error instanceof Error) {
        console.error(`=> Reason: ${error.message}`);
      }
      throw error;
    }
  };
}
