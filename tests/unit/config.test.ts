import { loadConfig } from '../../src/config/index.js';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('loadConfig', () => {
    it('should load valid configuration', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      const config = loadConfig();
      
      expect(config.geminiApiKey).toBe('test-api-key');
      expect(config.logLevel).toBe('info');
      expect(config.rateLimitEnabled).toBe(true);
    });

    it('should throw error for missing API key', () => {
      delete process.env.GEMINI_API_KEY;
      
      expect(() => loadConfig()).toThrow('GEMINI_API_KEY is required');
    });

    it('should use custom log level', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.LOG_LEVEL = 'debug';
      
      const config = loadConfig();
      
      expect(config.logLevel).toBe('debug');
    });

    it('should parse numeric values correctly', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.RATE_LIMIT_REQUESTS = '200';
      process.env.RATE_LIMIT_WINDOW = '120000';
      process.env.REQUEST_TIMEOUT = '60000';
      
      const config = loadConfig();
      
      expect(config.rateLimitRequests).toBe(200);
      expect(config.rateLimitWindow).toBe(120000);
      expect(config.requestTimeout).toBe(60000);
    });

    it('should parse boolean values correctly', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.ENABLE_METRICS = 'true';
      process.env.RATE_LIMIT_ENABLED = 'false';
      
      const config = loadConfig();
      
      expect(config.enableMetrics).toBe(true);
      expect(config.rateLimitEnabled).toBe(false);
    });

    it('should detect development environment', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.NODE_ENV = 'development';
      
      const config = loadConfig();
      
      expect(config.isDevelopment).toBe(true);
    });

    it('should throw error for invalid log level', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.LOG_LEVEL = 'invalid';
      
      expect(() => loadConfig()).toThrow('Configuration validation failed');
    });

    it('should throw error for invalid numeric values', () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      process.env.RATE_LIMIT_REQUESTS = 'not-a-number';
      
      expect(() => loadConfig()).toThrow('Configuration validation failed');
    });
  });
});
