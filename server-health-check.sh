#!/bin/bash

# Server Health Check and Recovery Script
echo "🔍 Checking Server Health..."

# Check if PM2 is running
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed"
    exit 1
fi

# Check PM2 status
echo "📊 PM2 Status:"
pm2 status

# Check if app is running
APP_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null)

if [ "$APP_STATUS" != "online" ]; then
    echo "⚠️  App is not running. Status: $APP_STATUS"
    echo "🔄 Attempting to restart..."
    
    # Try to restart
    pm2 restart all
    sleep 3
    
    # Check again
    NEW_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null)
    if [ "$NEW_STATUS" = "online" ]; then
        echo "✅ App restarted successfully!"
    else
        echo "❌ Restart failed. Trying fresh start..."
        pm2 delete all
        cd /var/www/smoothcodersweb || exit
        npm run build
        pm2 start npm --name "smoothcoders" -- start
    fi
else
    echo "✅ App is running"
fi

# Check logs
echo "📝 Recent Logs:"
pm2 logs --lines 20 --nostream

# Check port
echo "🔌 Checking Port 3000:"
if lsof -i:3000 &> /dev/null; then
    echo "✅ Port 3000 is in use"
else
    echo "❌ Port 3000 is not in use"
fi

echo "✅ Health check complete!"
