---
name: database-migration-update-v001
description: Standard workflow for syncing an imported database (e.g. from a live site) with the current codebase. Handles updating .env paths, clearing caches, and running missing migrations without data loss. Use when a user imports a .sqlite file or replaces the database/database.sqlite file and needs the app to point to it correctly and be up-to-date.
---

# Database Migration Update

This skill provides a standard workflow for integrating a database from a different environment (e.g., a production backup) into the current local environment.

## 1. Environment Preparation

Before running migrations, ensure all cached configurations are cleared. This prevents Laravel from using outdated paths or settings.

```bash
php artisan optimize:clear
```

## 2. Configuration Sync

When moving a project or importing a database, absolute paths in `.env` often become invalid. Update the following keys in your `.env` to match the current workspace root:

- `DB_DATABASE`: Point to the absolute path of your `database.sqlite` file.
- `FILESYSTEM_ROOT_PUBLIC`: Point to the absolute path of your `public/storage` folder.

> [!TIP]
> Use the absolute path obtained from `pwd` inside the project root to ensure accuracy.

## 3. Migration Check

Verify the current state of the database relative to the codebase's migrations. This will show you exactly which migrations are missing from the imported database.

```bash
php artisan migrate:status
```

## 4. Run Migrations

Apply the missing migrations. This is safe for existing data as long as the migrations are additive (adding tables/columns).

```bash
php artisan migrate
```

## 5. Final Polish

Clear caches again to ensure the newly migrated schema is fully recognized by the application.

```bash
php artisan optimize:clear
```
