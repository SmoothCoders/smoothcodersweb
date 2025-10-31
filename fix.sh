#!/bin/bash

echo "🔧 FIXING CITY ISSUE..."
echo ""

# Go to project directory
cd /Users/mac/Work/Development/SmoothCoders/smoothcoders-app

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory!"
    echo "Please run this from: /Users/mac/Work/Development/SmoothCoders/smoothcoders-app"
    exit 1
fi

echo "✅ In correct directory"
echo ""

# Run the fix
echo "Running fix script..."
node scripts/quick-fix-now.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ FIX COMPLETE!"
    echo ""
    echo "Now run: npm run dev"
    echo ""
else
    echo ""
    echo "❌ Fix failed. Check errors above."
    echo ""
fi
