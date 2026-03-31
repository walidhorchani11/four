-- Copie pour exécution manuelle sur Neon (P3005 / base déjà remplie).
-- Idempotent : peut être relancé si contraintes/colonnes déjà absentes.

ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_order_id_fkey";

DROP INDEX IF EXISTS "leads_order_id_key";

ALTER TABLE "leads" DROP COLUMN IF EXISTS "order_id";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "whatsapp_opened_at";
