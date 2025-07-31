/**
 * Custom error classes for the MCP Server
 */

export class MCPError extends Error {
  constructor(
    message: string,
    public code: number = -32603,
    public data?: any
  ) {
    super(message);
    this.name = 'MCPError';
  }

  toMCPResponse(id: any) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: this.code,
        message: this.message,
        ...(this.data && { data: this.data })
      }
    };
  }
}

export class ValidationError extends MCPError {
  constructor(message: string, data?: any) {
    super(message, -32602, data);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends MCPError {
  constructor(message: string = 'Invalid API key') {
    super(message, -32001);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends MCPError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, -32002);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends MCPError {
  constructor(message: string = 'Request timeout') {
    super(message, -32003);
    this.name = 'TimeoutError';
  }
}

export class GeminiAPIError extends MCPError {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message, -32603);
    this.name = 'GeminiAPIError';
    this.data = originalError;
  }
}

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  static handleGeminiError(error: any): GeminiAPIError {
    if (error?.error) {
      const geminiError = error.error;
      let message = 'Gemini API error';

      if (geminiError.message) {
        message = geminiError.message;
      } else if (geminiError.status) {
        message = `Gemini API error: ${geminiError.status}`;
      }

      return new GeminiAPIError(message, geminiError);
    }

    return new GeminiAPIError('Unknown Gemini API error', error);
  }

  static isRetryableError(error: any): boolean {
    if (error instanceof GeminiAPIError) {
      const status = error.originalError?.status;
      // Retry on server errors and rate limits
      return (
        status === 'UNAVAILABLE' ||
        status === 'RESOURCE_EXHAUSTED' ||
        status === 'INTERNAL' ||
        error.originalError?.code === 503 ||
        error.originalError?.code === 429
      );
    }
    return false;
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 16000);
  }
}

/**
 * Async retry utility with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts - 1 || !ErrorHandler.isRetryableError(error)) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
