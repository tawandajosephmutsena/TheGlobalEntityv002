---
name: sqlite-data-migration
description: Quickly migrate data from an old local SQLite database file into a newer SQLite database file after running migrations, taking care of newly added fields gracefully. Use when needing to refresh a local Laravel database (`php artisan migrate:fresh`) while retaining all data from an older `.sqlite` database.
---

# SQLite Data Migration

This skill preserves existing data when performing database refreshes (`php artisan migrate:fresh`) in Laravel applications using SQLite. It copies an existing SQLite database to a temporary location, drops and recreates all tables, and then carefully migrates old data back into the fresh tables.

## Workflow

When the user asks to refresh the database and migrate the data:

1. **Verify Database Location**
Ensure the current database (`database/database.sqlite`) and the old database (e.g. `database.sqlite` in the root) exist. Keep track of their absolute paths.

2. **Deploy the Migration Script**
Copy the bundled Laravel console command from `scripts/MigrateSqliteData.php` to the application's commands directory:
`cp /path/to/skill/scripts/MigrateSqliteData.php app/Console/Commands/`

3. **Verify/Update Script Paths**
Double check that `app/Console/Commands/MigrateSqliteData.php` contains the correct absolute paths for `$oldDbPath` and `$newDbPath`. Modify the values in the `handle` method if the databases are located differently.

4. **Execute the Migration**
Run the operations in order:
```bash
php artisan migrate:fresh
php artisan app:migrate-sqlite-data
php artisan optimize:clear
```

## How It Works

The `MigrateSqliteData` command connects to both databases simultaneously. For each table in the schema:
- It gets the columns in the *new* database structure.
- It pulls the rows from the *old* database.
- It maps the old data to the new schema by only keeping values for keys that still exist.
- It preserves any pre-seeded data created by migrations (like default application settings or base DB records) to avoid constraint violations.
