# Configuration Guide

## Environment Variables

The MCP Server Gemini can be configured using environment variables or a `.env` file.

### Required Configuration

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ | Your Google AI Studio API key | `AIzaSyBCmjkUwSC6409pyCSq6qHd-XMelU` |

### Optional Configuration

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) | `debug` |
| `ENABLE_METRICS` | `false` | Enable performance metrics | `true` |
| `RATE_LIMIT_ENABLED` | `true` | Enable rate limiting | `false` |
| `RATE_LIMIT_REQUESTS` | `100` | Max requests per window | `200` |
| `RATE_LIMIT_WINDOW` | `60000` | Rate limit window in ms | `120000` |
| `REQUEST_TIMEOUT` | `30000` | Request timeout in ms | `60000` |
| `NODE_ENV` | `production` | Environment mode | `development` |

### Example .env File

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional - Logging
LOG_LEVEL=info
ENABLE_METRICS=false

# Optional - Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000

# Optional - Timeouts
REQUEST_TIMEOUT=30000

# Optional - Development
NODE_ENV=production
```

## MCP Client Configuration

### Claude Desktop

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
        "LOG_LEVEL": "debug",
        "RATE_LIMIT_REQUESTS": "200",
        "REQUEST_TIMEOUT": "60000"
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

### Cursor IDE

Add to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "gemini": {
      "type": "stdio",
      "command": "mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Windsurf

Configure in Windsurf settings:

```json
{
  "mcp": {
    "servers": {
      "gemini": {
        "command": "mcp-server-gemini",
        "env": {
          "GEMINI_API_KEY": "your_api_key_here"
        }
      }
    }
  }
}
```

## Security Configuration

### API Key Management

#### Best Practices
1. **Never commit API keys** to version control
2. **Use environment variables** or secure secret management
3. **Rotate keys regularly** for production use
4. **Use different keys** for development and production

#### Secure Storage Options

**Option 1: Environment Variables**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

**Option 2: .env File (Development)**
```bash
# .env
GEMINI_API_KEY=your_api_key_here
```

**Option 3: System Keychain (macOS)**
```bash
security add-generic-password -a "mcp-gemini" -s "gemini-api-key" -w "your_api_key_here"
```

**Option 4: Docker Secrets**
```yaml
# docker-compose.yml
services:
  mcp-server:
    image: mcp-server-gemini
    secrets:
      - gemini_api_key
secrets:
  gemini_api_key:
    external: true
```

### Rate Limiting Configuration

Configure rate limiting to protect your API quota:

```bash
# Conservative settings
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=50
RATE_LIMIT_WINDOW=60000

# High-throughput settings
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=500
RATE_LIMIT_WINDOW=60000

# Disable for development
RATE_LIMIT_ENABLED=false
```

## Performance Configuration

### Timeout Settings

```bash
# Conservative (stable connections)
REQUEST_TIMEOUT=30000

# Aggressive (fast networks)
REQUEST_TIMEOUT=10000

# Patient (complex requests)
REQUEST_TIMEOUT=120000
```

### Logging Configuration

```bash
# Production
LOG_LEVEL=warn
ENABLE_METRICS=true

# Development
LOG_LEVEL=debug
ENABLE_METRICS=false

# Debugging
LOG_LEVEL=debug
ENABLE_METRICS=true
```

## Troubleshooting Configuration

### Common Issues

#### 1. API Key Not Found
```bash
# Check if environment variable is set
echo $GEMINI_API_KEY

# Verify .env file exists and is readable
cat .env | grep GEMINI_API_KEY
```

#### 2. Permission Errors
```bash
# Check file permissions
ls -la .env

# Fix permissions
chmod 600 .env
```

#### 3. Rate Limiting Issues
```bash
# Temporarily disable rate limiting
RATE_LIMIT_ENABLED=false

# Increase limits
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=60000
```

### Debug Configuration

Enable debug mode for troubleshooting:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "mcp-server-gemini",
      "env": {
        "GEMINI_API_KEY": "your_api_key_here",
        "LOG_LEVEL": "debug",
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Validation

The server validates all configuration on startup. Invalid configuration will result in clear error messages:

```
Configuration validation failed:
geminiApiKey: GEMINI_API_KEY is required
rateLimitRequests: Expected number, received string
```

## Configuration Schema

The server uses Zod for configuration validation. See `src/config/index.ts` for the complete schema definition.

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
RATE_LIMIT_ENABLED=false
REQUEST_TIMEOUT=60000
```

### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
REQUEST_TIMEOUT=30000
ENABLE_METRICS=true
```

### Testing
```bash
NODE_ENV=test
LOG_LEVEL=error
RATE_LIMIT_ENABLED=false
REQUEST_TIMEOUT=10000
```
