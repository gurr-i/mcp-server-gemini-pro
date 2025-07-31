# 🤖 MCP Server Gemini

<!-- [![npm version](https://badge.fury.io/js/mcp-server-gemini.svg)](https://badge.fury.io/js/mcp-server-gemini) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
<!-- [![CI](https://github.com/gurr-i/mcp-server-gemini/workflows/CI/badge.svg)](https://github.com/gurr-i/mcp-server-gemini/actions) -->

A **state-of-the-art Model Context Protocol (MCP) server** that provides seamless integration with Google's Gemini AI models. This server enables Claude Desktop and other MCP-compatible clients to leverage the full power of Gemini's advanced AI capabilities.

## ✨ Features

### 🧠 **Latest Gemini Models**
- **Gemini 2.5 Pro** - Most capable thinking model for complex reasoning
- **Gemini 2.5 Flash** - Fast thinking model with best price/performance  
- **Gemini 2.0 Series** - Latest generation models with advanced features
- **Gemini 1.5 Series** - Proven, reliable models for production use

### 🚀 **Advanced Capabilities**
- **🧠 Thinking Models** - Gemini 2.5 series with step-by-step reasoning
- **🔍 Google Search Grounding** - Real-time web information integration
- **📊 JSON Mode** - Structured output with schema validation
- **🎯 System Instructions** - Behavior customization and control
- **👁️ Vision Support** - Image analysis and multimodal capabilities
- **💬 Conversation Memory** - Context preservation across interactions

### 🛠️ **Production Ready**
- **TypeScript** - Full type safety and modern development
- **Comprehensive Error Handling** - Robust error management and recovery
- **Rate Limiting** - Built-in protection against API abuse
- **Detailed Logging** - Comprehensive monitoring and debugging
- **Input Validation** - Secure parameter validation with Zod
- **Retry Logic** - Automatic retry with exponential backoff

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** ([Download](https://nodejs.org/))
- **Google AI Studio API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

#### Option 1: Global Installation (Recommended)
```bash
npm install -g mcp-server-gemini
```

#### Option 2: Local Development
```bash
git clone https://github.com/gurr-i/mcp-server-gemini.git
cd mcp-server-gemini
npm install
npm run build
```

### Configuration

#### 1. Set up your API key

**Option A: Environment Variable**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

**Option B: .env file**
```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

#### 2. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

**For Global Installation:**
```json
{
  "mcpServers": {
    "gemini": {
      "command": "mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**For Local Installation:**
```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["/path/to/mcp-server-gemini/dist/enhanced-stdio-server.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### 3. Restart Claude Desktop

Close and restart Claude Desktop completely for changes to take effect.

## 💡 Usage Examples

Once configured, you can use Gemini through Claude Desktop with natural language:

### Basic Text Generation
```
"Use Gemini to explain quantum computing in simple terms"
"Generate a creative story about AI using Gemini 2.5 Pro"
```

### Advanced Features
```
"Use Gemini with JSON mode to extract key points from this text"
"Use Gemini with grounding to get the latest news about AI"
"Generate a Python function using Gemini's thinking capabilities"
```

### Image Analysis
```
"Analyze this image with Gemini" (attach image)
"What's in this screenshot using Gemini vision?"
```

### Development Tasks
```
"Use Gemini to review this code and suggest improvements"
"Generate comprehensive tests for this function using Gemini"
```

## ⚙️ Configuration

### Environment Variables

The server can be configured using environment variables or a `.env` file:

#### Required Configuration
```bash
# Google AI Studio API Key (required)
GEMINI_API_KEY=your_api_key_here
```

#### Optional Configuration
```bash
# Logging level (default: info)
# Options: error, warn, info, debug
LOG_LEVEL=info

# Enable performance metrics (default: false)
ENABLE_METRICS=false

# Rate limiting configuration
RATE_LIMIT_ENABLED=true        # Enable/disable rate limiting (default: true)
RATE_LIMIT_REQUESTS=100        # Max requests per window (default: 100)
RATE_LIMIT_WINDOW=60000        # Time window in ms (default: 60000 = 1 minute)

# Request timeout in milliseconds (default: 30000 = 30 seconds)
REQUEST_TIMEOUT=30000

# Environment mode (default: production)
NODE_ENV=production
```

### Environment Setup

#### Development Environment
```bash
# .env for development
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
LOG_LEVEL=debug
RATE_LIMIT_ENABLED=false
REQUEST_TIMEOUT=60000
```

#### Production Environment
```bash
# .env for production
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000
REQUEST_TIMEOUT=30000
ENABLE_METRICS=true
```

### Claude Desktop Configuration

#### Configuration File Locations
| OS | Path |
|----|------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

#### Basic Configuration
```json
{
  "mcpServers": {
    "gemini": {
      "command": "mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Advanced Configuration
```json
{
  "mcpServers": {
    "gemini": {
      "command": "mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here",
        "LOG_LEVEL": "info",
        "RATE_LIMIT_REQUESTS": "200",
        "REQUEST_TIMEOUT": "45000"
      }
    }
  }
}
```

#### Local Development Configuration
```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["/path/to/mcp-server-gemini/dist/enhanced-stdio-server.js"],
      "cwd": "/path/to/mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here",
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## 🛠️ Available Tools

| Tool | Description | Key Features |
|------|-------------|--------------|
| **generate_text** | Generate text with advanced features | Thinking models, JSON mode, grounding |
| **analyze_image** | Analyze images using vision models | Multi-modal understanding, detailed analysis |
| **count_tokens** | Count tokens for cost estimation | Accurate token counting for all models |
| **list_models** | List all available Gemini models | Real-time model availability and features |
| **embed_text** | Generate text embeddings | High-quality vector representations |
| **get_help** | Get usage help and documentation | Self-documenting with examples |

## 📊 Model Comparison

| Model | Context Window | Features | Best For | Speed |
|-------|----------------|----------|----------|-------|
| **gemini-2.5-pro** | 2M tokens | Thinking, JSON, Grounding | Complex reasoning, coding | Slower |
| **gemini-2.5-flash** ⭐ | 1M tokens | Thinking, JSON, Grounding | General purpose | Fast |
| **gemini-2.5-flash-lite** | 1M tokens | Thinking, JSON | High-throughput tasks | Fastest |
| **gemini-2.0-flash** | 1M tokens | JSON, Grounding | Standard tasks | Fast |
| **gemini-2.0-flash-lite** | 1M tokens | JSON | Simple tasks | Fastest |
| **gemini-2.0-pro-experimental** | 2M tokens | JSON, Grounding | Experimental features | Medium |
| **gemini-1.5-pro** | 2M tokens | JSON | Legacy support | Medium |
| **gemini-1.5-flash** | 1M tokens | JSON | Legacy support | Fast |

## 🔧 Development

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm 7+** (comes with Node.js)
- **Git** for version control
- **Google AI Studio API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Setup
```bash
# Clone the repository
git clone https://github.com/gurr-i/mcp-server-gemini.git
cd mcp-server-gemini

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Available Scripts

#### Development
```bash
npm run dev          # Start development server with hot reload
npm run dev:watch    # Start with file watching (nodemon)
npm run build        # Build for production
npm run build:watch  # Build with watch mode
npm run clean        # Clean build directory
```

#### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:integration # Run integration tests (requires API key)
```

#### Code Quality
```bash
npm run lint         # Lint TypeScript code
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
npm run validate     # Run all quality checks (lint + test + type-check)
```

#### Release & Distribution
```bash
npm run prepack      # Prepare package for publishing
npm run release      # Build, validate, and publish to npm
```

### Project Structure
```
mcp-server-gemini/
├── src/                          # Source code
│   ├── config/                   # Configuration management
│   │   └── index.ts             # Environment config with Zod validation
│   ├── utils/                   # Utility modules
│   │   ├── logger.ts           # Structured logging system
│   │   ├── errors.ts           # Custom error classes & handling
│   │   ├── validation.ts       # Input validation with Zod
│   │   └── rateLimiter.ts      # Rate limiting implementation
│   ├── enhanced-stdio-server.ts # Main MCP server implementation
│   └── types.ts                # TypeScript type definitions
├── tests/                       # Test suite
│   ├── unit/                   # Unit tests
│   │   ├── config.test.ts      # Configuration tests
│   │   ├── validation.test.ts  # Validation tests
│   │   └── errors.test.ts      # Error handling tests
│   ├── integration/            # Integration tests
│   │   └── gemini-api.test.ts  # Real API integration tests
│   └── setup.ts               # Test setup and utilities
├── docs/                       # Documentation
│   ├── api.md                 # API reference
│   ├── configuration.md       # Configuration guide
│   └── troubleshooting.md     # Troubleshooting guide
├── scripts/                    # Build and utility scripts
│   ├── build.sh              # Production build script
│   ├── dev.sh                # Development script
│   └── test.sh               # Test execution script
├── .github/workflows/         # GitHub Actions CI/CD
│   ├── ci.yml                # Continuous integration
│   └── release.yml           # Automated releases
├── dist/                      # Built output (generated)
├── coverage/                  # Test coverage reports (generated)
└── node_modules/             # Dependencies (generated)
```

## 🧪 Testing

### Test Suite Overview
The project includes comprehensive testing with unit tests, integration tests, and code coverage reporting.

### Running Tests

#### All Tests
```bash
npm test                    # Run all tests (unit tests only by default)
npm run test:watch         # Run tests in watch mode for development
npm run test:coverage      # Run tests with coverage report
```

#### Unit Tests
```bash
npm test -- --testPathPattern=unit    # Run only unit tests
npm test -- --testNamePattern="config" # Run specific test suites
```

#### Integration Tests
Integration tests require a valid `GEMINI_API_KEY` and make real API calls:

```bash
# Set API key and run integration tests
GEMINI_API_KEY=your_api_key_here npm run test:integration

# Or set in .env file and run
npm run test:integration
```

#### Test Coverage
```bash
npm run test:coverage      # Generate coverage report
open coverage/lcov-report/index.html  # View coverage report (macOS)
```

### Test Structure

#### Unit Tests (`tests/unit/`)
- **Configuration Tests**: Environment variable validation, config loading
- **Validation Tests**: Input validation, schema validation, sanitization
- **Error Handling Tests**: Custom error classes, error recovery, retry logic
- **Utility Tests**: Logger, rate limiter, helper functions

#### Integration Tests (`tests/integration/`)
- **Gemini API Tests**: Real API calls to test connectivity and functionality
- **Model Testing**: Verify all supported models work correctly
- **Feature Testing**: JSON mode, grounding, embeddings, token counting

### Writing Tests

#### Test File Structure
```typescript
// tests/unit/example.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { YourModule } from '../../src/your-module.js';

describe('YourModule', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

#### Custom Matchers
The test suite includes custom Jest matchers:
```typescript
expect(response).toBeValidMCPResponse(); // Validates MCP response format
```

### Test Configuration
Tests are configured in `jest.config.js` with:
- **TypeScript Support**: Full ES modules and TypeScript compilation
- **Coverage Thresholds**: Minimum 70% coverage required
- **Test Timeout**: 30 seconds for integration tests
- **Setup Files**: Automatic test environment setup

## 🐳 Docker Deployment

### Using Docker

#### Build and Run
```bash
# Build the Docker image
docker build -t mcp-server-gemini .

# Run the container
docker run -d \
  --name mcp-server-gemini \
  -e GEMINI_API_KEY=your_api_key_here \
  -e LOG_LEVEL=info \
  mcp-server-gemini
```

#### Using Docker Compose
```bash
# Create .env file with your API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

#### Development with Docker
```bash
# Start development environment
docker-compose --profile dev up

# This mounts source code for live reloading
```

### Environment-Specific Deployments

#### Production Deployment
```bash
# Production build
docker build --target production -t mcp-server-gemini:prod .

# Run with production settings
docker run -d \
  --name mcp-server-gemini-prod \
  --restart unless-stopped \
  -e GEMINI_API_KEY=your_api_key_here \
  -e NODE_ENV=production \
  -e LOG_LEVEL=warn \
  -e RATE_LIMIT_ENABLED=true \
  -e ENABLE_METRICS=true \
  mcp-server-gemini:prod
```

#### Health Checks
```bash
# Check container health
docker ps
docker logs mcp-server-gemini

# Manual health check
docker exec mcp-server-gemini node -e "console.log('Health check passed')"
```

## 🚀 Deployment Options

### 1. npm Global Installation
```bash
# Install globally
npm install -g mcp-server-gemini

# Run directly
GEMINI_API_KEY=your_key mcp-server-gemini
```

### 2. Local Installation
```bash
# Clone and build
git clone https://github.com/gurr-i/mcp-server-gemini.git
cd mcp-server-gemini
npm install
npm run build

# Run locally
GEMINI_API_KEY=your_key npm start
```

### 3. Docker Deployment
```bash
# Using Docker Hub (when published)
docker run -e GEMINI_API_KEY=your_key mcp-server-gemini:latest

# Using local build
docker build -t mcp-server-gemini .
docker run -e GEMINI_API_KEY=your_key mcp-server-gemini
```

### 4. Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mcp-server-gemini',
    script: './dist/enhanced-stdio-server.js',
    env: {
      NODE_ENV: 'production',
      GEMINI_API_KEY: 'your_api_key_here',
      LOG_LEVEL: 'info'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Server Won't Start
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# Verify .env file exists and is readable
cat .env | grep GEMINI_API_KEY

# Check file permissions
ls -la .env
chmod 600 .env
```

#### 2. API Key Issues
```bash
# Test API key manually
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

#### 3. Claude Desktop Integration
```bash
# Verify config file location (macOS)
ls -la ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Validate JSON syntax
cat claude_desktop_config.json | jq .

# Check server installation
which mcp-server-gemini
npm list -g mcp-server-gemini
```

#### 4. Rate Limiting
```bash
# Temporarily disable rate limiting
export RATE_LIMIT_ENABLED=false

# Increase limits
export RATE_LIMIT_REQUESTS=1000
export RATE_LIMIT_WINDOW=60000
```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug
npm run dev

# Or for production
export LOG_LEVEL=debug
npm start
```

### Getting Help
- 🐛 [Report Issues](https://github.com/gurr-i/mcp-server-gemini/issues)
- 💬 [Discussions](https://github.com/gurr-i/mcp-server-gemini/discussions)
- 📚 [Documentation](docs/)

## 🔒 Security

### API Key Security
- **Never commit API keys** to version control
- **Use environment variables** or secure secret management
- **Rotate keys regularly** for production use
- **Use different keys** for development and production

### Rate Limiting
- **Enable rate limiting** in production (`RATE_LIMIT_ENABLED=true`)
- **Configure appropriate limits** based on your usage patterns
- **Monitor API usage** to prevent quota exhaustion

### Input Validation
- All inputs are **automatically validated** and sanitized
- **XSS and injection protection** built-in
- **Schema validation** for all tool parameters

### Container Security
- Runs as **non-root user** in Docker
- **Read-only filesystem** with minimal privileges
- **Security scanning** in CI/CD pipeline

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Configuration Guide](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `npm run validate`
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- Anthropic for the Model Context Protocol
- The open-source community for inspiration and feedback

## 📞 Support

- 🐛 [Report Issues](https://github.com/gurr-i/mcp-server-gemini/issues)
- 💬 [Discussions](https://github.com/gurr-i/mcp-server-gemini/discussions)
- 📧 [Email Support](mailto:gopal@ph.iitr.ac.in)

---

<div align="center">
  <strong>Made with ❤️ By Gurveer for the AI development community</strong>
</div>
