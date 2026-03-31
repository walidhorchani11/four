-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_order_id_fkey";

-- DropIndex
DROP INDEX "leads_order_id_key";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "order_id",
DROP COLUMN "whatsapp_opened_at";
