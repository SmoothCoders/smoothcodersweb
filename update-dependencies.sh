#!/bin/bash

echo "🔄 Updating SmoothCoders Dependencies..."

# Update npm to latest
npm install -g npm@latest

# Update package.json dependencies to latest
npx npm-check-updates -u

# Install updated dependencies
npm install --legacy-peer-deps

# Audit and fix vulnerabilities
npm audit fix --force

# Check for outdated packages
npm outdated

echo "✅ Dependencies updated!"
echo "⚠️  Please test thoroughly before deploying!"
