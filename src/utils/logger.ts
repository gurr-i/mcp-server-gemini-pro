import { config } from '../config/index.js';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
};

class Logger {
  private currentLevel: LogLevel;

  constructor() {
    this.currentLevel = LOG_LEVEL_MAP[config.logLevel] ?? LogLevel.INFO;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.padEnd(5)} ${message}${metaStr}`;
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any): void {
    if (level <= this.currentLevel) {
      const formattedMessage = this.formatMessage(levelName, message, meta);
      
      // Use stderr for logging to avoid interfering with MCP protocol on stdout
      if (level === LogLevel.ERROR) {
        console.error(formattedMessage);
      } else {
        console.error(formattedMessage);
      }
    }
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, '❌ ERROR', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, '⚠️  WARN', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, 'ℹ️  INFO', message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, '🐛 DEBUG', message, meta);
  }

  // Convenience methods with emojis for better UX
  startup(message: string, meta?: any): void {
    this.info(`🚀 ${message}`, meta);
  }

  success(message: string, meta?: any): void {
    this.info(`✅ ${message}`, meta);
  }

  request(message: string, meta?: any): void {
    this.debug(`📨 ${message}`, meta);
  }

  response(message: string, meta?: any): void {
    this.debug(`📤 ${message}`, meta);
  }

  api(message: string, meta?: any): void {
    this.debug(`🤖 ${message}`, meta);
  }

  security(message: string, meta?: any): void {
    this.warn(`🔒 ${message}`, meta);
  }
}

export const logger = new Logger();
