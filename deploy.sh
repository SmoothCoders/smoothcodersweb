#!/bin/bash

# Auto-deploy script for SmoothCoders
# This script pulls latest code, builds, and restarts the app

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /home/smoothcoders/htdocs/smoothcoders.com

# Load NVM
export NVM_DIR="/home/smoothcoders/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Pull latest code from GitHub
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies if package.json changed
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting application..."
pm2 restart smoothcoders

# Show status
pm2 list

echo "✅ Deployment complete!"
