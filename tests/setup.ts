import 'dotenv/config';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  // Suppress console output during tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Global test timeout
jest.setTimeout(30000);

// Mock timers for tests that need them
beforeEach(() => {
  jest.clearAllTimers();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Extend Jest matchers if needed
expect.extend({
  toBeValidMCPResponse(received) {
    const pass = 
      received &&
      typeof received === 'object' &&
      received.jsonrpc === '2.0' &&
      received.id !== undefined &&
      (received.result !== undefined || received.error !== undefined);

    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be a valid MCP response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be a valid MCP response`,
        pass: false,
      };
    }
  },
});

// Type declaration for custom matcher
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidMCPResponse(): R;
    }
  }
}
