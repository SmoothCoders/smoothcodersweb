#!/bin/bash

echo "🔄 RESTARTING SERVER..."
echo ""

# Kill existing Next.js processes
echo "Killing old Next.js processes..."
pkill -f "next dev" 2>/dev/null
sleep 2

# Remove lock file
echo "Removing lock file..."
rm -f /Users/mac/Work/Development/SmoothCoders/smoothcoders-app/.next/dev/lock

# Go to project directory
cd /Users/mac/Work/Development/SmoothCoders/smoothcoders-app

# Start server
echo ""
echo "✅ Starting fresh server..."
echo ""
npm run dev
