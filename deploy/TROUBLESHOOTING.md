# OttoStart cPanel Deployment Troubleshooting Guide

> **Last Updated:** January 2026  
> **Based on:** Real deployment debugging session for otto-mate.space

This document summarizes common issues encountered when deploying OttoStart to cPanel shared hosting and their solutions.

---

## 📁 Expected Server Structure

```
/home/[username]/
├── ottomate/              ← Laravel app (everything EXCEPT public folder)
│   ├── app/
│   ├── bootstrap/
│   │   └── cache/         ← Must be writable (755)
│   ├── config/
│   ├── database/
│   │   └── database.sqlite
│   ├── resources/
│   ├── storage/           ← Must be writable (755)
│   │   ├── app/public/    ← Actual uploaded files location
│   │   ├── framework/
│   │   └── logs/
│   ├── vendor/
│   └── .env               ← Copy from .env.production
│
└── public_html/           ← Contents of /public folder
    ├── build/             ← Vite compiled assets
    │   └── manifest.json
    ├── storage/           ← Symlink to ../ottomate/storage/app/public
    ├── index.php          ← Modified for cPanel
    ├── .htaccess
    └── [other public assets]
```

---

## 🔧 Issue #1: Vite Manifest Not Found

### Symptoms
```
Vite manifest not found at: /home/[username]/ottomate/public/build/manifest.json
```

### Cause
Laravel doesn't know that `public_html` is the public directory instead of `ottomate/public`.

### Solution
Add `usePublicPath()` to `public_html/index.php`:

```php
// Bootstrap Laravel and handle the request...
$app = require_once $laravelRoot.'/bootstrap/app.php';

// Set the public path to THIS directory (public_html on cPanel)
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
```

> [!IMPORTANT]
> This line tells Laravel that `public_html` is where assets are served from, not the default `/public` folder inside the Laravel app.

---

## 🔧 Issue #2: Malformed .env File

### Symptoms
- 500 Internal Server Error
- Laravel boots successfully in debug.php but site doesn't load
- Error after editing .env through admin panel or manually

### Common Causes

#### Missing Closing Quotes
```env
# ❌ WRONG - Missing closing quote
MAIL_FROM_NAME="${APP_NAME}

# ✅ CORRECT
MAIL_FROM_NAME="${APP_NAME}"
```

#### Special Characters in Values
```env
# ❌ WRONG - Unquoted value with special characters
APP_NAME=My Cool App!

# ✅ CORRECT - Quoted value
APP_NAME="My Cool App"
```

#### Spaces in Unquoted Values
```env
# ❌ WRONG
APP_NAME=Ottomate Web-App

# ✅ CORRECT
APP_NAME="Ottomate Web-App"
```

### Prevention
- Always wrap values containing spaces or special characters in double quotes
- After editing .env, validate syntax before saving
- Use simple alphanumeric names when possible: `APP_NAME=Ottomate`

---

## 🔧 Issue #3: Storage/Uploads Not Working

### Symptoms
- Uploaded images show 404 or broken
- File upload fails silently

### Solution
Add `FILESYSTEM_ROOT_PUBLIC` to `.env`:

```env
FILESYSTEM_DISK=public
FILESYSTEM_ROOT_PUBLIC=/home/[username]/public_html/storage
```

Also ensure the storage symlink exists:
```
public_html/storage → ../ottomate/storage/app/public
```

Create via cpanel-helper.php → "Storage Link" or manually in File Manager.

---

## 🔧 Issue #4: cpanel-helper.php 500 Error

### Symptoms
- cpanel-helper.php returns 500 error
- Can't run artisan commands

### Cause
The script was using the wrong path to the Laravel installation.

### Solution
Ensure the `runCommand` function points to the correct Laravel path:

```php
function runCommand($command): array {
    $output = [];
    $returnCode = 0;
    
    // Laravel app is at /home/[username]/ottomate/ (sibling to public_html)
    $laravelPath = dirname(__DIR__) . '/ottomate';
    $fullCommand = 'cd ' . $laravelPath . ' && php artisan ' . $command . ' 2>&1';
    exec($fullCommand, $output, $returnCode);
    
    return [
        'command' => 'php artisan ' . $command,
        'success' => $returnCode === 0,
        'output' => implode("\n", $output),
    ];
}
```

---

## 🔧 Issue #5: Cached Configuration Errors

### Symptoms
- Made changes but old errors persist
- Site worked before, now broken after config change

### Solution
Clear all Laravel caches. Use cpanel-helper.php or manually delete:

1. **Delete cached config/routes/views:**
   - `/home/[username]/ottomate/bootstrap/cache/*` (all files, keep folder)
   - `/home/[username]/ottomate/storage/framework/views/*`
   - `/home/[username]/ottomate/storage/framework/cache/data/*`

2. **Via cpanel-helper.php:**
   - Click "🧹 Clear Caches" button

---

## 📋 Pre-Deployment Checklist

Before uploading to cPanel:

- [ ] Run `npm run build` to compile frontend assets
- [ ] Run `composer install --no-dev --optimize-autoloader`
- [ ] Verify `public/build/manifest.json` exists
- [ ] Review `.env.production` settings

After uploading:

- [ ] Rename `.env.production` to `.env`
- [ ] Verify database path in `.env` matches server structure
- [ ] Set permissions: `storage/`, `bootstrap/cache/` → 755
- [ ] Create storage symlink
- [ ] Clear all caches
- [ ] Test the site

---

## 🛡️ Security Reminders

> [!CAUTION]
> **After successful deployment, DELETE these files immediately:**
> - `public_html/debug.php`
> - `public_html/cpanel-helper.php`

These files provide diagnostic access that should never be left on production servers.

Also verify:
- `APP_DEBUG=false` in `.env`
- `APP_ENV=production` in `.env`

---

## 🔍 Quick Debugging Steps

1. **Upload `debug.php`** to `public_html`
2. **Visit** `https://your-domain.com/debug.php`
3. **Check each section:**
   - PHP version and extensions
   - File paths and permissions
   - .env configuration
   - Database connectivity
   - Laravel boot test
   - Recent error log

4. **Fix issues** based on the output
5. **Delete `debug.php`** when done

---

## 📝 .env Template for cPanel

```env
APP_NAME="Your App Name"
APP_ENV=production
APP_KEY=base64:your-key-here
APP_DEBUG=false
APP_URL=https://your-domain.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=single
LOG_LEVEL=error

DB_CONNECTION=sqlite
DB_DATABASE=/home/[username]/ottomate/database/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
FILESYSTEM_ROOT_PUBLIC=/home/[username]/public_html/storage
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=your-app-cache

MAIL_MAILER=smtp
MAIL_HOST=mail.your-domain.com
MAIL_PORT=465
MAIL_USERNAME=noreply@your-domain.com
MAIL_PASSWORD="your-password"
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```

---

## 📚 Related Documentation

- [deploy/README.md](./README.md) - Deployment tools overview
- [deploy/verify.sh](./verify.sh) - Pre-deployment verification script
- [deploy/create-package.sh](./create-package.sh) - Create deployment package
