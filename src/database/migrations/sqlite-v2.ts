export const SQLITE_V2_SQL = `
  -- Drop denormalized transaction_count columns from categories and tags.
  -- Counts are now computed live via COUNT(*) / GROUP BY queries.
  -- Both columns had CHECK (transaction_count >= 0) constraints that are
  -- also dropped alongside the columns.

  CREATE TABLE IF NOT EXISTS categories_v2 (
    id                 TEXT PRIMARY KEY NOT NULL,
    name               TEXT NOT NULL,
    type               TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    icon               TEXT,
    color_scheme_name  TEXT,
    created_at         TEXT NOT NULL,
    updated_at         TEXT NOT NULL
  );

  INSERT INTO categories_v2 (id, name, type, icon, color_scheme_name, created_at, updated_at)
    SELECT id, name, type, icon, color_scheme_name, created_at, updated_at FROM categories;

  DROP TABLE categories;
  ALTER TABLE categories_v2 RENAME TO categories;

  CREATE TABLE IF NOT EXISTS tags_v2 (
    id                TEXT PRIMARY KEY NOT NULL,
    name              TEXT NOT NULL,
    type              TEXT NOT NULL CHECK (type IN ('generic', 'location', 'contact')),
    color_scheme_name TEXT,
    icon              TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  INSERT INTO tags_v2 (id, name, type, color_scheme_name, icon, created_at, updated_at)
    SELECT id, name, type, color_scheme_name, icon, created_at, updated_at FROM tags;

  DROP TABLE tags;
  ALTER TABLE tags_v2 RENAME TO tags;
`

export const SQLITE_V2_VERSION = 2
