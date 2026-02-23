---
description: Deploy OttoStart to cPanel shared hosting (Verpex)
---
# cPanel Deployment Workflow

Follow these steps to deploy OttoStart to Verpex cPanel hosting.

## Pre-Deployment (Local)

// turbo

1. Clear all caches:

   ```bash
   php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear
   ```

// turbo

1. Install production dependencies:

   ```bash
   composer install --no-dev --optimize-autoloader
   ```

// turbo

1. Build frontend assets:

   ```bash
   npm ci && npm run build
   ```

// turbo

1. Create deployment package:

   ```bash
   ./deploy/create-package.sh
   ```

## Upload to Verpex cPanel

1. Log into Verpex cPanel dashboard

2. Go to **Select PHP Version** and set PHP to 8.2+

3. Enable required extensions: ctype, curl, dom, fileinfo, filter, hash, mbstring, openssl, pcre, pdo, pdo_sqlite, session, tokenizer, xml, gd, zip, intl

4. Upload `ottostart_production.zip` to `/home/YOUR_USERNAME/` via File Manager

5. Extract the archive

6. If main domain: Move contents of `public/` to `public_html/`

## Post-Upload Configuration (via SSH Terminal)

1. Set permissions:

   ```bash
   cd ~/public_html
   chmod -R 755 storage bootstrap/cache
   chmod 644 database/database.sqlite
   ```

2. Create storage symlink:

   ```bash
   php artisan storage:link
   ```

3. Optimize for production (caches config, routes, views, events):

   ```bash
   php artisan optimize
   ```

4. Run migrations if needed:

   ```bash
   php artisan migrate --force
   ```

5. Restart SSR process (if SSR is enabled):

   ```bash
   php artisan inertia:stop-ssr; php artisan inertia:start-ssr &
   ```

## Verification

1. Visit <https://your-domain.com> and verify the site loads

2. Test login/authentication

3. Check that images and uploads work

4. Verify admin panel access

5. Check SSR health (if enabled):

   ```bash
   php artisan inertia:check-ssr
   ```

## Troubleshooting

- Check `storage/logs/laravel.log` for errors
- Verify `.env` has correct `APP_URL` and database path
- Ensure `APP_DEBUG=false` in production
- Run `php artisan cache:clear` if seeing stale data
