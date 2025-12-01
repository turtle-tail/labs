-- Add score_key column to results table
ALTER TABLE results ADD COLUMN IF NOT EXISTS score_key VARCHAR(10);

-- Update existing results with their score keys
UPDATE results SET score_key = 'AG' WHERE id = '00000000-0000-0000-0002-000000000001';
UPDATE results SET score_key = 'DR' WHERE id = '00000000-0000-0000-0002-000000000002';
UPDATE results SET score_key = 'CC' WHERE id = '00000000-0000-0000-0002-000000000003';
UPDATE results SET score_key = 'CE' WHERE id = '00000000-0000-0000-0002-000000000004';
UPDATE results SET score_key = 'BR' WHERE id = '00000000-0000-0000-0002-000000000005';
UPDATE results SET score_key = 'BS' WHERE id = '00000000-0000-0000-0002-000000000006';
UPDATE results SET score_key = 'DS' WHERE id = '00000000-0000-0000-0002-000000000007';
UPDATE results SET score_key = 'AF' WHERE id = '00000000-0000-0000-0002-000000000008';
