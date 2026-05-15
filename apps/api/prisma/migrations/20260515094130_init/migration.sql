-- CreateTable
CREATE TABLE "agency_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "agency_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "type_id" INTEGER NOT NULL,
    "head_name" TEXT,
    "head_title" TEXT,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agency_types_slug_key" ON "agency_types"("slug");

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "agency_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
