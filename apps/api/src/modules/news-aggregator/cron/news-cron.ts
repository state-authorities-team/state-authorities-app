import cron from "node-cron";
import prisma from "../../../configs/db-config.js";
import { NewsImportService } from "../services/news-import-service.js";

export class NewsCronManager {
  private readonly newsImportService = new NewsImportService();
  private activeJob: cron.ScheduledTask | null = null;
  private currentCronExpression = "";
  private isSyncRunning = false;

  initScheduleSync(): void {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} : [CronManager] Initializing dynamic-cron watcher thread...`);

    this.refreshSchedule().catch((err) => console.error("Initial cron setup failed:", err));
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
        const time = new Date().toISOString();
        console.log(
          `${time} : [CronManager] Detected cron schedule mutation from DB. Updating target line to: "${dbCronExpression}"`,
        );

        this.updateCronJob(dbCronExpression);
      }
    } catch (error) {
      console.error("[CronManager ERROR] Failed to fetch layout from SystemConfig schema:", error);
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
    const loopTime = new Date().toISOString();

    if (this.isSyncRunning) {
      console.warn(
        `${loopTime} : [CronManager] Pipeline intersection blocked. Processing loop is busy.`,
      );
      return;
    }

    try {
      this.isSyncRunning = true;
      console.log(`${loopTime} : [CronManager Worker] Commencing automated state harvesting...`);

      const agencies = await prisma.agency.findMany({
        where: { AND: [{ website: { not: null } }, { website: { not: "" } }] },
        select: { id: true, website: true },
      });

      let totalSyncedNews = 0;
      for (const agency of agencies) {
        try {
          const website = agency.website;
          if (!website) {
            console.log(
              `[CronManager Worker WARN] Agency with ID ${agency.id} was skipped due website missing`,
            );
            continue;
          }
          const count = await this.newsImportService.runAutomatedLiveImport(agency.id, website);
          totalSyncedNews += count;
        } catch (agencyError) {
          console.error(
            `[CronManager Worker ERROR] Agency ID ${agency.id} sync collapsed:`,
            agencyError,
          );
        }
      }
      console.log(
        `${new Date().toISOString()} : [CronManager SUCCESS] Synchronization sequence finalized. Imported: ${totalSyncedNews}`,
      );
    } finally {
      this.isSyncRunning = false;
    }
  }
}
