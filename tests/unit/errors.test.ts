import {
  MCPError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
  TimeoutError,
  GeminiAPIError,
  ErrorHandler,
  withRetry
} from '../../src/utils/errors.js';

describe('Error Classes', () => {
  describe('MCPError', () => {
    it('should create error with default code', () => {
      const error = new MCPError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(-32603);
      expect(error.name).toBe('MCPError');
    });

    it('should create error with custom code and data', () => {
      const error = new MCPError('Test error', -32602, { field: 'value' });

      expect(error.code).toBe(-32602);
      expect(error.data).toEqual({ field: 'value' });
    });

    it('should convert to MCP response format', () => {
      const error = new MCPError('Test error', -32602, { field: 'value' });
      const response = error.toMCPResponse('test-id');

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 'test-id',
        error: {
          code: -32602,
          message: 'Test error',
          data: { field: 'value' }
        }
      });
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with correct code', () => {
      const error = new ValidationError('Invalid parameter');

      expect(error.message).toBe('Invalid parameter');
      expect(error.code).toBe(-32602);
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = new AuthenticationError();

      expect(error.message).toBe('Invalid API key');
      expect(error.code).toBe(-32001);
      expect(error.name).toBe('AuthenticationError');
    });

    it('should create authentication error with custom message', () => {
      const error = new AuthenticationError('Custom auth error');

      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with default message', () => {
      const error = new RateLimitError();

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe(-32002);
      expect(error.name).toBe('RateLimitError');
    });
  });

  describe('TimeoutError', () => {
    it('should create timeout error with default message', () => {
      const error = new TimeoutError();

      expect(error.message).toBe('Request timeout');
      expect(error.code).toBe(-32003);
      expect(error.name).toBe('TimeoutError');
    });
  });

  describe('GeminiAPIError', () => {
    it('should create Gemini API error', () => {
      const originalError = { status: 'INVALID_ARGUMENT' };
      const error = new GeminiAPIError('API error', originalError);

      expect(error.message).toBe('API error');
      expect(error.code).toBe(-32603);
      expect(error.name).toBe('GeminiAPIError');
      expect(error.originalError).toBe(originalError);
      expect(error.data).toBe(originalError);
    });
  });
});

describe('ErrorHandler', () => {
  describe('handleGeminiError', () => {
    it('should handle error with message', () => {
      const geminiError = {
        error: {
          message: 'API key not valid'
        }
      };

      const result = ErrorHandler.handleGeminiError(geminiError);

      expect(result).toBeInstanceOf(GeminiAPIError);
      expect(result.message).toBe('API key not valid');
      expect(result.originalError).toBe(geminiError.error);
    });

    it('should handle error with status', () => {
      const geminiError = {
        error: {
          status: 'UNAVAILABLE'
        }
      };

      const result = ErrorHandler.handleGeminiError(geminiError);

      expect(result.message).toBe('Gemini API error: UNAVAILABLE');
    });

    it('should handle unknown error format', () => {
      const geminiError = { unknown: 'format' };

      const result = ErrorHandler.handleGeminiError(geminiError);

      expect(result.message).toBe('Unknown Gemini API error');
      expect(result.originalError).toBe(geminiError);
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable Gemini API errors', () => {
      const retryableErrors = [
        new GeminiAPIError('Error', { status: 'UNAVAILABLE' }),
        new GeminiAPIError('Error', { status: 'RESOURCE_EXHAUSTED' }),
        new GeminiAPIError('Error', { status: 'INTERNAL' }),
        new GeminiAPIError('Error', { code: 503 }),
        new GeminiAPIError('Error', { code: 429 })
      ];

      retryableErrors.forEach(error => {
        expect(ErrorHandler.isRetryableError(error)).toBe(true);
      });
    });

    it('should identify non-retryable errors', () => {
      const nonRetryableErrors = [
        new GeminiAPIError('Error', { status: 'INVALID_ARGUMENT' }),
        new GeminiAPIError('Error', { code: 400 }),
        new ValidationError('Invalid input'),
        new Error('Generic error')
      ];

      nonRetryableErrors.forEach(error => {
        expect(ErrorHandler.isRetryableError(error)).toBe(false);
      });
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate exponential backoff delays', () => {
      expect(ErrorHandler.getRetryDelay(0)).toBe(1000);
      expect(ErrorHandler.getRetryDelay(1)).toBe(2000);
      expect(ErrorHandler.getRetryDelay(2)).toBe(4000);
      expect(ErrorHandler.getRetryDelay(3)).toBe(8000);
      expect(ErrorHandler.getRetryDelay(4)).toBe(16000);
    });

    it('should cap delay at maximum', () => {
      expect(ErrorHandler.getRetryDelay(10)).toBe(16000);
    });
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed on first attempt', async () => {
    const operation = jest.fn().mockResolvedValue('success');

    const result = await withRetry(operation, 3);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable error', async () => {
    const retryableError = new GeminiAPIError('Error', { status: 'UNAVAILABLE' });
    const operation = jest.fn()
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValue('success');

    const result = await withRetry(operation, 3);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should not retry on non-retryable error', async () => {
    const nonRetryableError = new ValidationError('Invalid input');
    const operation = jest.fn().mockRejectedValue(nonRetryableError);

    await expect(withRetry(operation, 3)).rejects.toThrow(ValidationError);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should throw last error after max attempts', async () => {
    const retryableError = new GeminiAPIError('Error', { status: 'UNAVAILABLE' });
    const operation = jest.fn().mockRejectedValue(retryableError);

    await expect(withRetry(operation, 3)).rejects.toThrow(GeminiAPIError);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should wait between retries', async () => {
    const retryableError = new GeminiAPIError('Error', { status: 'UNAVAILABLE' });
    const operation = jest.fn()
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValue('success');

    const startTime = Date.now();
    await withRetry(operation, 3, 100);
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
