#!/bin/bash

echo "🧪 TESTING ALL FIXES..."
echo ""

cd /Users/mac/Work/Development/SmoothCoders/smoothcoders-app

echo "✅ In project directory"
echo ""

# Check if server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Server is running on port 3000"
    echo ""
    echo "🌐 Opening admin panel..."
    sleep 2
    open http://localhost:3000/admin/cities
elif lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Server is running on port 3001"
    echo ""
    echo "🌐 Opening admin panel..."
    sleep 2
    open http://localhost:3001/admin/cities
else
    echo "❌ Server is not running!"
    echo ""
    echo "Starting server now..."
    echo ""
    npm run dev
fi
