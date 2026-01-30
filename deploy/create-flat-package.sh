#!/bin/bash

# ============================================================
# OttoStart Flat Production Package Creator
# For cPanel Subdomains (All files in one directory)
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  OttoStart Flat Package Creator (Subdomain)${NC}"
echo -e "${BLUE}============================================${NC}"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Step 1: Clear caches
echo -e "\n${GREEN}[1/6] Clearing caches...${NC}"
php artisan cache:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

# Step 2: Prepare dependencies
echo -e "\n${GREEN}[2/6] Preparing dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction --no-scripts 2>/dev/null || true
# Clear discovery caches after composer install to avoid "DuskServiceProvider not found" errors
rm -f bootstrap/cache/*.php
composer dump-autoload --optimize --no-scripts

# Step 3: Build frontend assets
echo -e "\n${GREEN}[3/6] Building frontend assets...${NC}"
npm run build

# Step 4: Create package
echo -e "\n${GREEN}[4/6] Creating deployment package...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="ottostart_flat_${TIMESTAMP}.zip"

TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}   Using temp directory: ${TEMP_DIR}${NC}"

# Copy Core Folders
echo -e "${YELLOW}   Copying core folders...${NC}"
cp -r app "$TEMP_DIR/"
cp -r bootstrap "$TEMP_DIR/"
cp -r config "$TEMP_DIR/"
cp -r database "$TEMP_DIR/"
cp -r lang "$TEMP_DIR/"
cp -r resources "$TEMP_DIR/"
cp -r routes "$TEMP_DIR/"
cp -r storage "$TEMP_DIR/"
cp -r vendor "$TEMP_DIR/"
cp -r Modules "$TEMP_DIR/" 2>/dev/null || true
cp -r components "$TEMP_DIR/" 2>/dev/null || true

# Copy Root Files
cp artisan "$TEMP_DIR/"
cp composer.json "$TEMP_DIR/"
cp composer.lock "$TEMP_DIR/"
cp .env.production "$TEMP_DIR/.env"

# Copy EVERYTHING FROM public/ to root
echo -e "${YELLOW}   Merging public folder into root...${NC}"
cp -r public/* "$TEMP_DIR/"
cp public/.htaccess "$TEMP_DIR/" 2>/dev/null || true

# Step 5: Patch index.php and create production .htaccess for flat structure
echo -e "\n${GREEN}[5/6] Patching index.php and creating .htaccess...${NC}"
cat > "$TEMP_DIR/index.php" << 'EOF'
<?php
define('LARAVEL_START', microtime(true));

// Maintenance mode
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Autoloader
require __DIR__.'/vendor/autoload.php';

// Bootstrap
$app = require_once __DIR__.'/bootstrap/app.php';

// Set public path to root
$app->usePublicPath(__DIR__);

// Handle request
$app->handleRequest(Illuminate\Http\Request::capture());
EOF

# Create an optimized .htaccess for the flat deployment structure
cat > "$TEMP_DIR/.htaccess" << 'EOF'
# ============================================================
# OttoStart Optimized .htaccess (Flat structure)
# ============================================================

Options +SymLinksIfOwnerMatch
Options -MultiViews -Indexes

<IfModule mod_rewrite.c>
    RewriteEngine On

    # 1. SECURITY: Block access to Laravel core folders and sensitive files
    RewriteRule ^(\.env|\.git|composer\.(json|lock)|package\.(json|lock)|vite\.config\.(js|ts))$ - [F,L]
    RewriteRule ^(app|bootstrap|config|database|resources|routes|tests|vendor|storage/framework|storage/logs)/ - [F,L]

    # 2. Force HTTPS in production
    RewriteCond %{HTTPS} !=on
    RewriteCond %{HTTP_HOST} !^localhost
    RewriteCond %{HTTP_HOST} !^127\.0\.0\.1
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # 3. Handle Headers (Authorization & XSRF)
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # 4. STORAGE ACCESS: Map /storage/X requests to /storage/app/public/X if not found
    RewriteCond %{REQUEST_URI} ^/storage/(.*)$
    RewriteCond %{DOCUMENT_ROOT}/storage/%1 !-f
    RewriteRule ^storage/(.*)$ storage/app/public/$1 [L]

    # 5. Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # 6. Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF

# Step 6: Create Zip (Optimized for upload limits)
echo -e "\n${GREEN}[6/6] Creating zip archive...${NC}"

# Clean up any leftover temp files in storage before zipping
echo -e "${YELLOW}   Cleaning up temporary files...${NC}"
rm -rf "$TEMP_DIR/storage/logs/"*
rm -rf "$TEMP_DIR/storage/framework/cache/data/"*
rm -rf "$TEMP_DIR/storage/framework/sessions/"*
rm -rf "$TEMP_DIR/storage/framework/views/"*
mkdir -p "$TEMP_DIR/storage/logs"
mkdir -p "$TEMP_DIR/storage/framework/cache/data"
mkdir -p "$TEMP_DIR/storage/framework/sessions"
mkdir -p "$TEMP_DIR/storage/framework/views"
touch "$TEMP_DIR/storage/logs/.gitignore"
touch "$TEMP_DIR/storage/framework/cache/.gitignore"
touch "$TEMP_DIR/storage/framework/sessions/.gitignore"
touch "$TEMP_DIR/storage/framework/views/.gitignore"

echo -e "${YELLOW}   Zipping files (excluding large videos to avoid upload errors)...${NC}"
cd "$TEMP_DIR"
# Exclude heavy videos (.mp4, .mov, .webm) and system files
zip -r "$PROJECT_ROOT/$PACKAGE_NAME" . \
    -x "*.DS_Store" \
    -x "*__MACOSX*" \
    -x "*.mp4" \
    -x "*.mov" \
    -x "*.webm" \
    -x "*.zip" \
    -x "*.gz" \
    -x "*.rar" > /dev/null

cd "$PROJECT_ROOT"
rm -rf "$TEMP_DIR"

echo -e "\n${BLUE}============================================${NC}"
echo -e "${GREEN}✅ Flat Deployment Package Ready!${NC}"
echo -e "   ${YELLOW}${PACKAGE_NAME}${NC}"
echo -e "   URL: https://fountainconstruction.co.zw/"
echo -e "\n${YELLOW}INSTRUCTIONS:${NC}"
echo "1. Upload this ZIP to your subdomain folder"
echo "2. Extract it"
echo "3. That's it! Everything is in one directory."
echo -e "${BLUE}============================================${NC}"
