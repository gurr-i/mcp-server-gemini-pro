#!/bin/bash

# Test script for MCP Server Gemini
set -e

echo "🧪 Running tests for MCP Server Gemini..."

# Run linting
echo "🔍 Running ESLint..."
npx eslint src/**/*.ts --fix

# Run type checking
echo "📝 Type checking..."
npx tsc --noEmit

# Run unit tests
echo "🧪 Running unit tests..."
npx jest --coverage

# Run integration tests if API key is available
if [ -n "$GEMINI_API_KEY" ]; then
    echo "🔗 Running integration tests..."
    npx jest --testPathPattern=integration
else
    echo "⚠️  Skipping integration tests (GEMINI_API_KEY not set)"
fi

echo "✅ All tests completed successfully!"
