import * as dotenv from "dotenv";
import { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";

dotenv.config();

// Ensure process.env.AI_API_KEY is defined so the constructor doesn't throw
if (!process.env.AI_API_KEY) {
  process.env.AI_API_KEY = "mock-api-key";
}

async function runRateLimitTest() {
  console.log("=== STARTING RATE LIMIT 429 HANDLING TEST ===");

  const analyzer = new NewsAiAnalyzerService();

  // Test Case 1: 429 error followed by a success (should retry and succeed)
  let callCount = 0;
  (analyzer as any).ai = {
    models: {
      generateContent: async (params: any) => {
        callCount++;
        console.log(`[Mock AI] generateContent called. Call count: ${callCount}`);
        if (callCount === 1) {
          console.log("[Mock AI] Throwing 429 RESOURCE_EXHAUSTED error");
          throw new Error(
            "GoogleGenAIError: [429 RESOURCE_EXHAUSTED] Quota exceeded for metric. Please retry in 2.5s.",
          );
        }
        console.log("[Mock AI] Returning successful response on retry");
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
    const selectors = await analyzer.generateSelectors("<html><body><div>News</div></body></html>");
    const duration = Date.now() - startTime;
    console.log(`\nResult selectors: ${JSON.stringify(selectors)}`);
    console.log(`Total duration: ${duration}ms`);
    // 2.5s delay is parsed as 3s + 1s buffer = 4s sleep. Let's make sure it slept at least 3.9s.
    if (callCount === 2 && selectors.container === "div.news-card" && duration >= 3900) {
      console.log(
        "✅ TEST 1 PASSED: Successfully retried, respected parsed sleep delay, and got selectors!",
      );
    } else {
      console.error(
        `❌ TEST 1 FAILED: Unexpected behavior. Call count: ${callCount}, duration: ${duration}ms`,
      );
    }
  } catch (err: any) {
    console.error("❌ TEST 1 FAILED: Unexpected error thrown", err);
  }

  console.log("\n--------------------------------------------------\n");

  // Test Case 2: 429 error occurs twice (should exhaust retries and fail)
  callCount = 0;
  (analyzer as any).ai = {
    models: {
      generateContent: async (params: any) => {
        callCount++;
        console.log(`[Mock AI] generateContent called. Call count: ${callCount}`);
        console.log("[Mock AI] Throwing 429 RESOURCE_EXHAUSTED error");
        throw new Error(
          "GoogleGenAIError: [429 RESOURCE_EXHAUSTED] Quota exceeded for metric. Please retry in 2.5s.",
        );
      },
    },
  };

  try {
    console.log("Starting Test 2: AI fails twice with 429");
    await analyzer.generateSelectors("<html><body><div>News</div></body></html>");
    console.error("❌ TEST 2 FAILED: Expected error to be thrown but it succeeded");
  } catch (err: any) {
    console.log(`Caught expected error: ${err.message}`);
    if (callCount === 2) {
      console.log(
        "✅ TEST 2 PASSED: Tried exactly 2 times (1 initial + 1 retry) and threw the error.",
      );
    } else {
      console.error(`❌ TEST 2 FAILED: Expected 2 calls, got ${callCount}`);
    }
  }
}

runRateLimitTest().catch(console.error);
