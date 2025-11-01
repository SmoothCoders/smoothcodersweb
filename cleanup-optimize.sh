#!/bin/bash

# Comprehensive Cleanup and Optimization Script
# Run this on your VPS to clean and optimize everything

echo "🧹 Starting Comprehensive Cleanup & Optimization..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /home/smoothcoders/htdocs/smoothcoders.com

echo ""
echo "${YELLOW}📊 Current Disk Usage:${NC}"
du -sh .
echo ""

# 1. Remove backup files and temp files
echo "${YELLOW}🗑️  Step 1: Removing backup and temporary files...${NC}"
find . -type f -name "*.bak" -delete 2>/dev/null
find . -type f -name "*.tmp" -delete 2>/dev/null
find . -type f -name "*.old" -delete 2>/dev/null
find . -type f -name "*~" -delete 2>/dev/null
find . -type f -name "*.swp" -delete 2>/dev/null
find . -type f -name ".DS_Store" -delete 2>/dev/null
echo "${GREEN}✓ Backup files removed${NC}"

# 2. Remove old logs
echo ""
echo "${YELLOW}📝 Step 2: Cleaning old logs...${NC}"
find . -type f -name "*.log" -mtime +7 -delete 2>/dev/null
echo "${GREEN}✓ Old logs cleaned${NC}"

# 3. Clean npm cache
echo ""
echo "${YELLOW}📦 Step 3: Cleaning npm cache...${NC}"
npm cache clean --force
echo "${GREEN}✓ npm cache cleaned${NC}"

# 4. Remove old builds
echo ""
echo "${YELLOW}🔨 Step 4: Removing old build artifacts...${NC}"
rm -rf .next/cache/*
echo "${GREEN}✓ Build cache cleaned${NC}"

# 5. Clean node_modules and reinstall (production only)
echo ""
echo "${YELLOW}📚 Step 5: Optimizing node_modules...${NC}"
echo "This will remove devDependencies..."
rm -rf node_modules
npm ci --production --legacy-peer-deps
echo "${GREEN}✓ node_modules optimized (production only)${NC}"

# 6. Remove test files from production
echo ""
echo "${YELLOW}🧪 Step 6: Removing test files...${NC}"
find . -type f -name "*.test.ts" -delete 2>/dev/null
find . -type f -name "*.test.tsx" -delete 2>/dev/null
find . -type f -name "*.spec.ts" -delete 2>/dev/null
find . -type f -name "*.spec.tsx" -delete 2>/dev/null
find . -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null
echo "${GREEN}✓ Test files removed${NC}"

# 7. Remove unnecessary documentation
echo ""
echo "${YELLOW}📄 Step 7: Removing unnecessary docs...${NC}"
rm -f CODEBASE_OPTIMIZATION.md 2>/dev/null
rm -f TEST_AUTO_DEPLOY.txt 2>/dev/null
rm -f server-health-check.sh 2>/dev/null
rm -f TEST_NOW.sh 2>/dev/null
rm -f test-comprehensive.sh 2>/dev/null
rm -f update-dependencies.sh 2>/dev/null
rm -f fix.sh 2>/dev/null
echo "${GREEN}✓ Unnecessary docs removed${NC}"

# 8. Optimize images (if imagemagick is installed)
echo ""
echo "${YELLOW}🖼️  Step 8: Checking for image optimization...${NC}"
if command -v convert &> /dev/null; then
    find ./public -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec convert {} -quality 85 {} \; 2>/dev/null
    echo "${GREEN}✓ Images optimized${NC}"
else
    echo "${YELLOW}⚠ ImageMagick not installed, skipping image optimization${NC}"
fi

# 9. Clean PM2 logs
echo ""
echo "${YELLOW}🔄 Step 9: Cleaning PM2 logs...${NC}"
pm2 flush
echo "${GREEN}✓ PM2 logs flushed${NC}"

# 10. Rebuild production build
echo ""
echo "${YELLOW}🏗️  Step 10: Creating optimized production build...${NC}"
export NVM_DIR="/home/smoothcoders/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_ENV=production npm run build
echo "${GREEN}✓ Production build created${NC}"

# 11. Restart application
echo ""
echo "${YELLOW}♻️  Step 11: Restarting application...${NC}"
pm2 restart smoothcoders
pm2 save
echo "${GREEN}✓ Application restarted${NC}"

# 12. Show final stats
echo ""
echo "${YELLOW}📊 Final Disk Usage:${NC}"
du -sh .
echo ""

# 13. Show node_modules size
echo "${YELLOW}📦 node_modules size:${NC}"
du -sh node_modules
echo ""

# 14. Show .next build size
echo "${YELLOW}🔨 Build size:${NC}"
du -sh .next
echo ""

echo "${GREEN}================================================${NC}"
echo "${GREEN}✅ Cleanup and Optimization Complete!${NC}"
echo "${GREEN}================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Check if site is running: https://smoothcoders.com"
echo "2. Monitor PM2: pm2 monit"
echo "3. Check logs: pm2 logs smoothcoders"
