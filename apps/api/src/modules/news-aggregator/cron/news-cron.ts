import cron, { type ScheduledTask } from "node-cron";
import prisma from "../../../configs/db-config.js";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import { NewsImportService } from "../services/news-import-service.js";

const logger = baseLogger.child({ service: "CronManager" });

export class NewsCronManager {
  private readonly newsImportService = new NewsImportService();
  private activeJob: ScheduledTask | null = null;
  private currentCronExpression = "";
  private isSyncRunning = false;

  initScheduleSync(): void {
    logger.info("Initializing dynamic-cron watcher thread...");

    this.refreshSchedule().catch((err: unknown) =>
      logger.error(
        "Initial cron setup failed:",
        err instanceof Error ? err : new Error(String(err)),
      ),
    );
    cron.schedule("*/5 * * * *", async () => {
      await this.refreshSchedule();
    });
  }

  private async refreshSchedule(): Promise<void> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "NEWS_SYNC_CRON" },
      });

      const dbCronExpression = config?.value || "0 */3 * * *";

      if (this.currentCronExpression !== dbCronExpression && cron.validate(dbCronExpression)) {
        logger.info(
          `Detected cron schedule mutation from DB. Updating target line to: "${dbCronExpression}"`,
        );

        this.updateCronJob(dbCronExpression);
      }
    } catch (error) {
      logger.error("Failed to fetch layout from SystemConfig schema:", error);
    }
  }

  private updateCronJob(newExpression: string): void {
    if (this.activeJob) {
      this.activeJob.stop();
    }
    this.currentCronExpression = newExpression;
    this.activeJob = cron.schedule(newExpression, async () => {
      await this.executeSyncPipeline();
    });
  }

  private async executeSyncPipeline(): Promise<void> {
    if (this.isSyncRunning) {
      logger.warn("Pipeline intersection blocked. Processing loop is busy.");
      return;
    }

    try {
      this.isSyncRunning = true;
      logger.info("Commencing automated state harvesting...");

      const agencies = await prisma.agency.findMany({
        where: { AND: [{ website: { not: null } }, { website: { not: "" } }] },
        select: { id: true, website: true },
      });

      let totalSyncedNews = 0;
      for (const agency of agencies) {
        try {
          const website = agency.website;
          if (!website) {
            logger.debug(
              `Agency with ID ${agency.id} was skipped due to missing website attribute.`,
            );
            continue;
          }
          const count = await this.newsImportService.runAutomatedLiveImport(agency.id, website);
          totalSyncedNews += count;
        } catch (agencyError) {
          logger.error(`Agency ID ${agency.id} sync pipeline collapsed:`, agencyError);
        }
      }
      logger.info(
        `Synchronization sequence finalized successfully. Total imported records: ${totalSyncedNews}`,
      );
    } finally {
      this.isSyncRunning = false;
    }
  }
}
