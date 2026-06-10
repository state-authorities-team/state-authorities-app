-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "agency_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrape_configs" (
    "agency_id" INTEGER NOT NULL,
    "selectors" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scrape_configs_pkey" PRIMARY KEY ("agency_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_url_key" ON "news"("url");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scrape_configs" ADD CONSTRAINT "scrape_configs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
