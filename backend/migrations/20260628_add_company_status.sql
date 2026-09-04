BEGIN;

DO $$
BEGIN
    IF to_regclass('public.companies') IS NOT NULL THEN
        ALTER TABLE companies
            ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'active';

        UPDATE companies
        SET status = 'active'
        WHERE status IS NULL;

        ALTER TABLE companies
            ALTER COLUMN status SET DEFAULT 'active',
            ALTER COLUMN status SET NOT NULL;

        CREATE INDEX IF NOT EXISTS ix_companies_status ON companies (status);
    END IF;
END
$$;

COMMIT;
