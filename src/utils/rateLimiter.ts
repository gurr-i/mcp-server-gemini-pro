import { config } from '../config/index.js';
import { RateLimitError } from './errors.js';
import { logger } from './logger.js';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter using sliding window
 */
export class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private maxRequests: number = config.rateLimitRequests,
    private windowMs: number = config.rateLimitWindow
  ) {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if request is allowed for the given identifier
   */
  checkLimit(identifier: string = 'default'): void {
    if (!config.rateLimitEnabled) {
      return;
    }

    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry) {
      // First request for this identifier
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return;
    }

    if (now >= entry.resetTime) {
      // Window has expired, reset
      entry.count = 1;
      entry.resetTime = now + this.windowMs;
      return;
    }

    if (entry.count >= this.maxRequests) {
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);
      logger.security(`Rate limit exceeded for ${identifier}`, {
        count: entry.count,
        limit: this.maxRequests,
        resetIn
      });

      throw new RateLimitError(`Rate limit exceeded. Try again in ${resetIn} seconds.`);
    }

    entry.count++;
  }

  /**
   * Get current usage for identifier
   */
  getUsage(identifier: string = 'default'): { count: number; limit: number; resetTime: number } {
    const entry = this.requests.get(identifier);
    const now = Date.now();

    if (!entry || now >= entry.resetTime) {
      return {
        count: 0,
        limit: this.maxRequests,
        resetTime: now + this.windowMs
      };
    }

    return {
      count: entry.count,
      limit: this.maxRequests,
      resetTime: entry.resetTime
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [identifier, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(identifier);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired rate limit entries`);
    }
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string = 'default'): void {
    this.requests.delete(identifier);
    logger.debug(`Reset rate limit for ${identifier}`);
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();
