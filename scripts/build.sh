#!/bin/bash

# Build script for MCP Server Gemini
set -e

echo "🔧 Building MCP Server Gemini..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Type check
echo "🔍 Type checking..."
npx tsc --noEmit

# Build
echo "🏗️  Building TypeScript..."
npx tsc

# Copy additional files
echo "📋 Copying additional files..."
cp package.json dist/
cp README.md dist/
cp LICENSE dist/

echo "✅ Build completed successfully!"
echo "📦 Output directory: dist/"
