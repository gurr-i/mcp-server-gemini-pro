import { z } from 'zod';
import { ValidationError } from './errors.js';

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // Gemini model names
  geminiModel: z.enum([
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-pro-experimental',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ]),

  // Temperature range
  temperature: z.number().min(0).max(2),

  // Token limits
  maxTokens: z.number().min(1).max(8192),

  // Top-k and top-p parameters
  topK: z.number().min(1).max(100),
  topP: z.number().min(0).max(1),

  // Conversation ID
  conversationId: z.string().min(1).max(100),

  // JSON schema string
  jsonSchema: z.string().refine(val => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, 'Must be valid JSON'),

  // Safety settings string
  safetySettings: z.string().refine(val => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, 'Must be valid JSON array'),

  // Base64 image data
  base64Image: z
    .string()
    .regex(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, 'Must be valid base64 image data'),

  // URL validation
  imageUrl: z.string().url('Must be a valid URL')
};

/**
 * Tool parameter validation schemas
 */
export const ToolSchemas = {
  generateText: z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    model: CommonSchemas.geminiModel.optional(),
    systemInstruction: z.string().optional(),
    temperature: CommonSchemas.temperature.optional(),
    maxTokens: CommonSchemas.maxTokens.optional(),
    topK: CommonSchemas.topK.optional(),
    topP: CommonSchemas.topP.optional(),
    jsonMode: z.boolean().optional(),
    jsonSchema: CommonSchemas.jsonSchema.optional(),
    grounding: z.boolean().optional(),
    safetySettings: CommonSchemas.safetySettings.optional(),
    conversationId: CommonSchemas.conversationId.optional()
  }),

  analyzeImage: z
    .object({
      prompt: z.string().min(1, 'Prompt is required'),
      imageUrl: CommonSchemas.imageUrl.optional(),
      imageBase64: CommonSchemas.base64Image.optional(),
      model: z.enum(['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash']).optional()
    })
    .refine(
      data => data.imageUrl || data.imageBase64,
      'Either imageUrl or imageBase64 must be provided'
    ),

  countTokens: z.object({
    text: z.string().min(1, 'Text is required'),
    model: CommonSchemas.geminiModel.optional()
  }),

  listModels: z.object({
    filter: z.enum(['all', 'thinking', 'vision', 'grounding', 'json_mode']).optional()
  }),

  embedText: z.object({
    text: z.string().min(1, 'Text is required'),
    model: z.enum(['text-embedding-004', 'text-multilingual-embedding-002']).optional()
  }),

  getHelp: z.object({
    topic: z
      .enum(['overview', 'tools', 'models', 'parameters', 'examples', 'quick-start'])
      .optional()
  })
};

/**
 * Validation utility class
 */
export class Validator {
  /**
   * Validate tool parameters
   */
  static validateToolParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
    try {
      return schema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new ValidationError(`Invalid parameters: ${issues}`);
      }
      throw error;
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string, maxLength: number = 10000): string {
    if (typeof input !== 'string') {
      throw new ValidationError('Input must be a string');
    }

    if (input.length > maxLength) {
      throw new ValidationError(`Input too long (max ${maxLength} characters)`);
    }

    // Remove null bytes and other control characters except newlines and tabs
    // eslint-disable-next-line no-control-regex
    return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  /**
   * Validate JSON string
   */
  static validateJSON(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new ValidationError('Invalid JSON format');
    }
  }

  /**
   * Validate MCP request structure
   */
  static validateMCPRequest(request: any): void {
    if (!request || typeof request !== 'object') {
      throw new ValidationError('Request must be an object');
    }

    if (request.jsonrpc !== '2.0') {
      throw new ValidationError('Invalid JSON-RPC version');
    }

    if (typeof request.method !== 'string') {
      throw new ValidationError('Method must be a string');
    }

    if (request.id === undefined || request.id === null) {
      throw new ValidationError('Request ID is required');
    }
  }
}
