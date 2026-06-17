import * as dotenv from "dotenv";
import { logger as baseLogger } from "../../configs/logger-config.js";
import { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";

dotenv.config();

const logger = baseLogger.child({ service: "RateLimitTestHarness" });

// Ensure process.env.AI_API_KEY is defined so the constructor doesn't throw
if (!process.env.AI_API_KEY) {
  process.env.AI_API_KEY = "mock-api-key";
}

interface MockAiClient {
  models: {
    generateContent: (args: {
      model: string;
      contents: string | string[];
      config?: Record<string, unknown>;
    }) => Promise<{ text: string }>;
  };
}

async function runRateLimitTest() {
  logger.info("=== STARTING RATE LIMIT 429 HANDLING TEST ===");

  const analyzer = new NewsAiAnalyzerService();

  let callCount = 0;

  (analyzer as unknown as { aiClient: MockAiClient | null }).aiClient = {
    models: {
      generateContent: async () => {
        callCount++;
        logger.debug(`[Mock AI] generateContent called. Call count: ${callCount}`);
        if (callCount === 1) {
          logger.debug("[Mock AI] Throwing simulated 429 RESOURCE_EXHAUSTED error");
          throw new Error(
            "GoogleGenAIError: [429 RESOURCE_EXHAUSTED] Quota exceeded for metric. Please retry in 2.5s.",
          );
        }
        logger.debug("[Mock AI] Returning successful response on retry loop");
        return {
          text: JSON.stringify({
            container: "div.news-card",
            title: "h3",
            url: "a",
            date: "span",
          }),
        };
      },
    },
  };

  const startTime = Date.now();
  try {
    logger.info("Executing Test 1: AI fails once with 429, expecting backoff retry success...");
    const selectors = await analyzer.generateSelectors("<html><body><div>News</div></body></html>");
    const duration = Date.now() - startTime;

    if (!selectors) {
      logger.error("❌ TEST 1 FAILED: generateSelectors returned null unexpectedly");
      return;
    }

    logger.debug(`Result selectors: ${JSON.stringify(selectors)}`);
    logger.debug(`Total execution duration: ${duration}ms`);

    // 2.5s delay is parsed as 3s + 1s buffer = 4s sleep. Let's make sure it slept at least 3.9s.
    if (callCount === 2 && selectors.container === "div.news-card" && duration >= 3900) {
      logger.info(
        "✅ TEST 1 PASSED: Successfully retried, respected parsed sleep delay, and got selectors!",
      );
    } else {
      logger.error(
        `❌ TEST 1 FAILED: Unexpected execution fingerprint. Call count: ${callCount}, duration: ${duration}ms`,
      );
    }
  } catch (err: unknown) {
    logger.error("❌ TEST 1 FAILED: Unexpected error thrown down the pipeline cascade", err);
  }

  logger.info("--------------------------------------------------");

  // Test Case 2: 429 error occurs twice (should exhaust retries and fail)
  callCount = 0;
  (analyzer as unknown as { aiClient: MockAiClient | null }).aiClient = {
    models: {
      generateContent: async () => {
        callCount++;
        logger.debug(`[Mock AI] generateContent called. Call count: ${callCount}`);
        logger.debug("[Mock AI] Throwing systemic 429 RESOURCE_EXHAUSTED error");
        throw new Error(
          "GoogleGenAIError: [429 RESOURCE_EXHAUSTED] Quota exceeded for metric. Please retry in 2.5s.",
        );
      },
    },
  };

  try {
    logger.info(
      "Executing Test 2: AI fails consecutively with 429, expecting total exhaust block...",
    );
    await analyzer.generateSelectors("<html><body><div>News</div></body></html>");
    logger.error(
      "❌ TEST 2 FAILED: Expected error to be thrown but the method succeeded contextually",
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.debug(`Caught expected mock error stream: ${errorMessage}`);
    if (callCount === 2) {
      logger.info(
        "✅ TEST 2 PASSED: Tried exactly 2 times (1 initial + 1 retry) and threw the expected error.",
      );
    } else {
      logger.error(
        `❌ TEST 2 FAILED: Expected exactly 2 fallback calls, but intercepted ${callCount}`,
      );
    }
  }
}

runRateLimitTest().catch((fatalError) => {
  logger.error("Fatal uncaught exception during rate-limit test bootstrap execution:", fatalError);
});
