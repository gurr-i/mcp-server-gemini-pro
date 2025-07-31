#!/bin/bash

# Development script for MCP Server Gemini
set -e

echo "🚀 Starting MCP Server Gemini in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    echo "GEMINI_API_KEY=your_api_key_here" > .env
    echo "📝 Please edit .env file with your actual API key"
    exit 1
fi

# Check if API key is set
if ! grep -q "^GEMINI_API_KEY=.*[^=]$" .env; then
    echo "❌ GEMINI_API_KEY not set in .env file"
    echo "💡 Please add your Gemini API key to .env file"
    exit 1
fi

echo "✅ Environment configured"
echo "🔧 Starting development server with hot reload..."

# Start with ts-node and watch mode
npx nodemon --exec "node --loader ts-node/esm src/enhanced-stdio-server.ts" --ext ts --watch src/
