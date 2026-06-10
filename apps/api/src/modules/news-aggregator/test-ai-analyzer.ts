import axios from "axios";
import * as dotenv from "dotenv";
import { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";

dotenv.config();

const runTest = async (): Promise<void> => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} : [Test] Starting AI Analyzer integration test...`);

  const targetUrl = "https://www.adm-km.gov.ua/";

  const aiService = new NewsAiAnalyzerService();

  try {
    console.log(`${timestamp} : [Test] Fetching raw HTML from "${targetUrl}" via Axios...`);

    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const rawHtml = response.data as string;
    console.log(
      `${timestamp} : [Test] HTML downloaded successfully (${(rawHtml.length / 1024).toFixed(2)} KB).`,
    );

    console.log(`${timestamp} : [Test] Invoking Gemini AI model analysis...`);

    const startTime = Date.now();
    const selectors = await aiService.generateSelectors(rawHtml);
    const endTime = Date.now();

    console.log("\n================ TEST RESULT ================");
    console.log(`Execution Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    console.log("Generated CSS Selectors Matrix:");
    console.log(JSON.stringify(selectors, null, 2));
    console.log("================================================\n");
  } catch (error) {
    console.error(`${timestamp} : [Test CRITICAL ERROR] Pipeline failed!`);
    if (error instanceof Error) {
      console.error(`=> Message: ${error.message}`);
    } else {
      console.error(`=> Unknown error context:`, error);
    }
  }
};

runTest();
