import 'dotenv/config';
import { z } from 'zod';

// Configuration schema validation
const ConfigSchema = z.object({
  // API Configuration
  geminiApiKey: z.string().min(1, 'GEMINI_API_KEY is required'),
  
  // Server Configuration
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  enableMetrics: z.boolean().default(false),
  
  // Rate Limiting
  rateLimitEnabled: z.boolean().default(true),
  rateLimitRequests: z.number().default(100),
  rateLimitWindow: z.number().default(60000), // 1 minute
  
  // Timeouts
  requestTimeout: z.number().default(30000), // 30 seconds
  
  // Development
  isDevelopment: z.boolean().default(false),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): Config {
  const rawConfig = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    logLevel: process.env.LOG_LEVEL,
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    rateLimitRequests: process.env.RATE_LIMIT_REQUESTS ? parseInt(process.env.RATE_LIMIT_REQUESTS) : undefined,
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : undefined,
    requestTimeout: process.env.REQUEST_TIMEOUT ? parseInt(process.env.REQUEST_TIMEOUT) : undefined,
    isDevelopment: process.env.NODE_ENV === 'development',
  };

  try {
    return ConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Configuration validation failed:\n${issues}`);
    }
    throw error;
  }
}

// Export singleton config instance
export const config = loadConfig();
