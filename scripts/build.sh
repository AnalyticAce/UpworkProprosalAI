#!/bin/bash

# Upwork Proposal AI - Chrome Extension Build Script
# This script helps prepare the extension for installation/distribution

echo "🚀 Upwork Proposal AI - Build Script"
echo "===================================="

# Check if all required files exist
echo "📋 Checking file structure..."

required_files=(
    "manifest.json"
    "src/content.js"
    "src/popup.html"
    "src/popup.js"
    "assets/icons/icon16.png"
    "assets/icons/icon48.png"
    "assets/icons/icon128.png"
)

all_files_exist=true

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    echo ""
    echo "🎉 All required files are present!"
    echo ""
    echo "📦 Ready for Chrome installation:"
    echo "  1. Open Chrome and go to chrome://extensions/"
    echo "  2. Enable 'Developer mode'"
    echo "  3. Click 'Load unpacked' and select this folder"
    echo ""
    echo "🔗 Test URL: https://www.upwork.com/jobs/"
else
    echo ""
    echo "⚠️  Some files are missing. Please check the file structure."
    exit 1
fi
