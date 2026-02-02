#!/bin/bash

# ============================================================
# OttoStart Subfolder Deployment Package Creator
# For cPanel Shared Hosting (Add-on Domains in Subfolders)
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}  OttoStart Subfolder Package Creator (Ready-to-Go)${NC}"
echo -e "${BLUE}===================================================${NC}"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# 1. Clear caches
echo -e "\n${GREEN}[1/6] Clearing local caches...${NC}"
php artisan cache:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
rm -f bootstrap/cache/*.php

# 2. Build frontend assets
echo -e "\n${GREEN}[2/6] Building frontend assets...${NC}"
if [ ! -d "node_modules" ]; then
    npm ci --omit=dev
fi
npm run build

# 3. Prepare clean deployment directory
echo -e "\n${GREEN}[3/6] Preparing deployment directory...${NC}"
DEPLOY_DIR="$PROJECT_ROOT/deploy_package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy essential folders
echo -e "${YELLOW}   Copying folders...${NC}"
cp -r app "$DEPLOY_DIR/"
cp -r bootstrap "$DEPLOY_DIR/"
cp -r config "$DEPLOY_DIR/"
cp -r database "$DEPLOY_DIR/"
cp -r lang "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
mkdir -p "$DEPLOY_DIR/resources"
cp -r resources/views "$DEPLOY_DIR/resources/"
cp -r routes "$DEPLOY_DIR/"
cp -r vendor "$DEPLOY_DIR/"
if [ -d "Modules" ]; then cp -r Modules "$DEPLOY_DIR/"; fi

# Copy essential root files
echo -e "${YELLOW}   Copying root files...${NC}"
cp artisan "$DEPLOY_DIR/"
cp composer.json "$DEPLOY_DIR/"
cp composer.lock "$DEPLOY_DIR/"
cp index.php "$DEPLOY_DIR/"
cp .htaccess "$DEPLOY_DIR/"
if [ -f "modules_statuses.json" ]; then cp modules_statuses.json "$DEPLOY_DIR/"; fi

# Prepare Storage
echo -e "${YELLOW}   Setting up storage structure...${NC}"
mkdir -p "$DEPLOY_DIR/storage/app/public"
mkdir -p "$DEPLOY_DIR/storage/framework/cache/data"
mkdir -p "$DEPLOY_DIR/storage/framework/sessions"
mkdir -p "$DEPLOY_DIR/storage/framework/views"
mkdir -p "$DEPLOY_DIR/storage/logs"
echo "*\n!.gitignore" > "$DEPLOY_DIR/storage/framework/cache/data/.gitignore"
echo "*\n!.gitignore" > "$DEPLOY_DIR/storage/framework/sessions/.gitignore"
echo "*\n!.gitignore" > "$DEPLOY_DIR/storage/framework/views/.gitignore"
echo "*.log\n!.gitignore" > "$DEPLOY_DIR/storage/logs/.gitignore"

# Copy existing uploads if any
if [ -d "storage/app/public" ]; then
    cp -r storage/app/public/* "$DEPLOY_DIR/storage/app/public/" 2>/dev/null || true
fi

# 4. FIX FILES FOR RELATIVE SUBFOLDER DEPLOYMENT
echo -e "\n${GREEN}[4/6] Optimizing for subfolder deployment...${NC}"

# Fix public/index.php to be relative
echo -e "${YELLOW}   Updating public/index.php paths...${NC}"
cat > "$DEPLOY_DIR/public/index.php" << 'EOF'
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine the root directory relative to this file
$laravelRoot = __DIR__.'/..';

// Register the Composer autoloader...
require $laravelRoot.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $laravelRoot.'/bootstrap/app.php';

// Set the public path to THIS directory
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
EOF

# Update root .htaccess for better subfolder asset mapping
echo -e "${YELLOW}   Updating root .htaccess...${NC}"
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # 1. SECURITY: Block access to sensitive files
    RewriteRule ^(\.env|\.git|composer\.(json|lock)|package\.(json|lock)|vite\.config\.(js|ts))$ - [F,L]
    RewriteRule ^(app|bootstrap|config|database|resources|routes|tests|vendor)/ - [F,L]

    # 2. ASSETS: Map requests to the /public folder automatically
    # If a file is requested that doesn't exist in the root, look for it in /public/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L]

    # 3. ROUTING: Send everything else to our root index.php
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF

# Ensure storage/logs/laravel.log is writable/exists
touch "$DEPLOY_DIR/storage/logs/laravel.log"

# 5. Prepare .env for production
echo -e "\n${GREEN}[5/6] Preparing .env file...${NC}"
if [ -f ".env" ]; then
    # Create template from current .env
    cp .env "$DEPLOY_DIR/.env"
    
    # Update base fields we know will change
    # Note: Using sed cautiously
    sed -i '' "s|APP_ENV=.*|APP_ENV=production|g" "$DEPLOY_DIR/.env"
    sed -i '' "s|APP_DEBUG=.*|APP_DEBUG=false|g" "$DEPLOY_DIR/.env"
    sed -i '' "s|DB_DATABASE=.*|DB_DATABASE=/home/YOUR_CPANEL_USER/public_html/YOUR_DOMAIN_OR_SUBFOLDER/database/database.sqlite|g" "$DEPLOY_DIR/.env"
    sed -i '' "s|APP_URL=.*|APP_URL=https://notherchoice.org/YOUR_SUBFOLDER|g" "$DEPLOY_DIR/.env"
    sed -i '' "s|FILESYSTEM_ROOT_PUBLIC=.*|FILESYSTEM_ROOT_PUBLIC=/home/YOUR_CPANEL_USER/public_html/YOUR_SUBFOLDER/public/storage|g" "$DEPLOY_DIR/.env"
fi


# 6. Create Zip Archive
echo -e "\n${GREEN}[6/6] Creating zip archive...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="ottostart_subfolder_deploy_${TIMESTAMP}.zip"

cd "$DEPLOY_DIR"
zip -r "$PROJECT_ROOT/$PACKAGE_NAME" . -x "*.DS_Store" -x "*__MACOSX*" > /dev/null
cd "$PROJECT_ROOT"

echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}✅ SUCCESS! Deployment package created:${NC}"
echo -e "   ${YELLOW}${PACKAGE_NAME}${NC}"
echo -e "\n${YELLOW}INSTRUCTIONS:${NC}"
echo "1. Upload the zip file to your subfolder (e.g., public_html/notherchoice/demo/)"
echo "2. Extract the zip file in that folder"
echo "3. Edit the .env file in the subfolder:"
echo "   - Change DB_DATABASE to the absolute path on the server"
echo "   - Change APP_URL to match your domain and subfolder"
echo "   - Set YOUR_CPANEL_USER appropriately"
echo "4. Ensure storage/ and bootstrap/cache/ are writable (chmod 755)"
echo "5. The database.sqlite is included in the database/ folder"
echo -e "${BLUE}===================================================${NC}"

# Remove the temporary folder to keep things clean
rm -rf "$DEPLOY_DIR"
