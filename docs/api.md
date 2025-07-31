# API Documentation

## Overview

The MCP Server Gemini provides 6 powerful tools for interacting with Google's Gemini AI models through the Model Context Protocol.

## Tools

### 1. generate_text

Generate text using Gemini models with advanced features.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | ✅ | - | The text prompt to send to Gemini |
| `model` | string | ❌ | `gemini-2.5-flash` | Gemini model to use |
| `systemInstruction` | string | ❌ | - | System instruction to guide behavior |
| `temperature` | number | ❌ | `0.7` | Creativity level (0-2) |
| `maxTokens` | number | ❌ | `2048` | Maximum tokens to generate |
| `topK` | number | ❌ | `40` | Top-k sampling parameter |
| `topP` | number | ❌ | `0.95` | Top-p (nucleus) sampling |
| `jsonMode` | boolean | ❌ | `false` | Enable structured JSON output |
| `jsonSchema` | string | ❌ | - | JSON schema for validation (when jsonMode=true) |
| `grounding` | boolean | ❌ | `false` | Enable Google Search grounding |
| `safetySettings` | string | ❌ | - | Safety settings as JSON string |
| `conversationId` | string | ❌ | - | ID for conversation context |

#### Example Usage

```javascript
// Basic text generation
{
  "prompt": "Explain quantum computing in simple terms",
  "model": "gemini-2.5-flash",
  "temperature": 0.7
}

// JSON mode with schema
{
  "prompt": "Extract key information from this text: ...",
  "jsonMode": true,
  "jsonSchema": "{\"type\":\"object\",\"properties\":{\"summary\":{\"type\":\"string\"},\"keyPoints\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}}"
}

// With grounding for current information
{
  "prompt": "What are the latest developments in AI?",
  "grounding": true,
  "model": "gemini-2.5-pro"
}
```

### 2. analyze_image

Analyze images using Gemini's vision capabilities.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | ✅ | - | Question or instruction about the image |
| `imageUrl` | string | ❌* | - | URL of the image to analyze |
| `imageBase64` | string | ❌* | - | Base64-encoded image data |
| `model` | string | ❌ | `gemini-2.5-flash` | Vision-capable model |

*Either `imageUrl` or `imageBase64` must be provided.

#### Example Usage

```javascript
// Analyze image from URL
{
  "prompt": "What's in this image?",
  "imageUrl": "https://example.com/image.jpg",
  "model": "gemini-2.5-pro"
}

// Analyze base64 image
{
  "prompt": "Describe the technical diagram",
  "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### 3. count_tokens

Count tokens for cost estimation and planning.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ | - | Text to count tokens for |
| `model` | string | ❌ | `gemini-2.5-flash` | Model to use for counting |

#### Example Usage

```javascript
{
  "text": "This is a sample text to count tokens for cost estimation.",
  "model": "gemini-2.5-pro"
}
```

### 4. list_models

List all available Gemini models and their capabilities.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `filter` | string | ❌ | `all` | Filter models by capability |

#### Filter Options
- `all` - All available models
- `thinking` - Models with thinking capabilities
- `vision` - Models with vision support
- `grounding` - Models with Google Search grounding
- `json_mode` - Models supporting JSON mode

#### Example Usage

```javascript
// List all models
{
  "filter": "all"
}

// List only thinking models
{
  "filter": "thinking"
}
```

### 5. embed_text

Generate text embeddings using Gemini embedding models.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ | - | Text to generate embeddings for |
| `model` | string | ❌ | `text-embedding-004` | Embedding model to use |

#### Available Embedding Models
- `text-embedding-004` - Latest embedding model
- `text-multilingual-embedding-002` - Multilingual support

#### Example Usage

```javascript
{
  "text": "This is a sample text for embedding generation.",
  "model": "text-embedding-004"
}
```

### 6. get_help

Get help and usage information for the server.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `topic` | string | ❌ | `overview` | Help topic to get information about |

#### Available Topics
- `overview` - General overview and quick start
- `tools` - Detailed tool information
- `models` - Model selection guide
- `parameters` - Parameter explanations
- `examples` - Usage examples
- `quick-start` - Quick start guide

#### Example Usage

```javascript
// Get overview
{
  "topic": "overview"
}

// Get tool details
{
  "topic": "tools"
}
```

## Response Format

All tools return responses in the standard MCP format:

```javascript
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Response content here"
      }
    ],
    "metadata": {
      // Additional metadata
    }
  }
}
```

## Error Handling

Errors are returned in standard MCP error format:

```javascript
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": {
    "code": -32603,
    "message": "Error description",
    "data": {
      // Additional error details
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `-32602` | Invalid parameters |
| `-32603` | Internal error |
| `-32001` | Authentication error |
| `-32002` | Rate limit exceeded |
| `-32003` | Request timeout |

## Rate Limiting

The server implements rate limiting to protect against abuse:

- **Default**: 100 requests per minute
- **Configurable**: Set via environment variables
- **Per-client**: Rate limits are applied per client connection

## Best Practices

### Model Selection
- Use `gemini-2.5-flash` for general purposes
- Use `gemini-2.5-pro` for complex reasoning
- Use `gemini-2.5-flash-lite` for high-throughput tasks

### Parameter Optimization
- Lower temperature (0.1-0.3) for factual content
- Higher temperature (0.8-1.2) for creative content
- Use `maxTokens` to control response length and costs

### Error Handling
- Implement retry logic for transient errors
- Handle rate limiting gracefully
- Validate parameters before sending requests

### Performance
- Use conversation IDs to maintain context
- Cache embeddings when possible
- Monitor token usage for cost optimization
