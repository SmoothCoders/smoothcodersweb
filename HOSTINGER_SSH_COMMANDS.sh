#!/bin/bash

# Step 1: Find where your files are
echo "=== Finding your website files ==="
ls -la
pwd

# Step 2: Check available directories
echo -e "\n=== Checking domains directory ==="
ls -la domains/ 2>/dev/null || echo "No domains folder"

# Step 3: Find welaunch.in
echo -e "\n=== Finding welaunch.in ==="
find ~ -name "welaunch.in" -type d 2>/dev/null

# Step 4: Check if Node.js is available
echo -e "\n=== Checking Node.js ==="
which node
node --version 2>/dev/null || echo "Node.js not found in PATH"

# Step 5: Check for NVM (Node Version Manager)
echo -e "\n=== Checking for NVM ==="
ls -la ~/.nvm 2>/dev/null || echo "NVM not found"

# Step 6: List all files in home
echo -e "\n=== Home directory contents ==="
ls -la ~/
