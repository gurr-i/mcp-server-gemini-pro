import { Validator, ToolSchemas, CommonSchemas } from '../../src/utils/validation.js';
import { ValidationError } from '../../src/utils/errors.js';

describe('Validation', () => {
  describe('CommonSchemas', () => {
    describe('geminiModel', () => {
      it('should accept valid Gemini models', () => {
        const validModels = [
          'gemini-2.5-pro',
          'gemini-2.5-flash',
          'gemini-2.5-flash-lite',
          'gemini-2.0-flash',
          'gemini-1.5-pro'
        ];

        validModels.forEach(model => {
          expect(() => CommonSchemas.geminiModel.parse(model)).not.toThrow();
        });
      });

      it('should reject invalid models', () => {
        const invalidModels = ['gpt-4', 'claude-3', 'invalid-model'];

        invalidModels.forEach(model => {
          expect(() => CommonSchemas.geminiModel.parse(model)).toThrow();
        });
      });
    });

    describe('temperature', () => {
      it('should accept valid temperature values', () => {
        const validTemperatures = [0, 0.5, 1.0, 1.5, 2.0];

        validTemperatures.forEach(temp => {
          expect(() => CommonSchemas.temperature.parse(temp)).not.toThrow();
        });
      });

      it('should reject invalid temperature values', () => {
        const invalidTemperatures = [-0.1, 2.1, 'not-a-number'];

        invalidTemperatures.forEach(temp => {
          expect(() => CommonSchemas.temperature.parse(temp)).toThrow();
        });
      });
    });

    describe('jsonSchema', () => {
      it('should accept valid JSON strings', () => {
        const validSchemas = [
          '{"type": "object"}',
          '{"type": "string", "enum": ["a", "b"]}',
          '[]'
        ];

        validSchemas.forEach(schema => {
          expect(() => CommonSchemas.jsonSchema.parse(schema)).not.toThrow();
        });
      });

      it('should reject invalid JSON strings', () => {
        const invalidSchemas = [
          '{invalid json}',
          'not json at all',
          '{"unclosed": '
        ];

        invalidSchemas.forEach(schema => {
          expect(() => CommonSchemas.jsonSchema.parse(schema)).toThrow();
        });
      });
    });
  });

  describe('ToolSchemas', () => {
    describe('generateText', () => {
      it('should accept valid parameters', () => {
        const validParams = {
          prompt: 'Test prompt',
          model: 'gemini-2.5-flash',
          temperature: 0.7,
          maxTokens: 1000
        };

        expect(() => ToolSchemas.generateText.parse(validParams)).not.toThrow();
      });

      it('should require prompt', () => {
        const invalidParams = {
          model: 'gemini-2.5-flash'
        };

        expect(() => ToolSchemas.generateText.parse(invalidParams)).toThrow();
      });

      it('should reject empty prompt', () => {
        const invalidParams = {
          prompt: ''
        };

        expect(() => ToolSchemas.generateText.parse(invalidParams)).toThrow();
      });
    });

    describe('analyzeImage', () => {
      it('should accept valid parameters with imageUrl', () => {
        const validParams = {
          prompt: 'What is in this image?',
          imageUrl: 'https://example.com/image.jpg'
        };

        expect(() => ToolSchemas.analyzeImage.parse(validParams)).not.toThrow();
      });

      it('should accept valid parameters with imageBase64', () => {
        const validParams = {
          prompt: 'What is in this image?',
          imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        };

        expect(() => ToolSchemas.analyzeImage.parse(validParams)).not.toThrow();
      });

      it('should require either imageUrl or imageBase64', () => {
        const invalidParams = {
          prompt: 'What is in this image?'
        };

        expect(() => ToolSchemas.analyzeImage.parse(invalidParams)).toThrow();
      });

      it('should reject invalid imageUrl', () => {
        const invalidParams = {
          prompt: 'What is in this image?',
          imageUrl: 'not-a-url'
        };

        expect(() => ToolSchemas.analyzeImage.parse(invalidParams)).toThrow();
      });
    });
  });

  describe('Validator', () => {
    describe('validateToolParams', () => {
      it('should validate and return parsed parameters', () => {
        const params = {
          prompt: 'Test prompt',
          temperature: 0.7
        };

        const result = Validator.validateToolParams(ToolSchemas.generateText, params);

        expect(result.prompt).toBe('Test prompt');
        expect(result.temperature).toBe(0.7);
      });

      it('should throw ValidationError for invalid parameters', () => {
        const params = {
          prompt: '',
          temperature: 3.0
        };

        expect(() => {
          Validator.validateToolParams(ToolSchemas.generateText, params);
        }).toThrow(ValidationError);
      });
    });

    describe('sanitizeString', () => {
      it('should return clean string unchanged', () => {
        const input = 'This is a clean string with\nnewlines and\ttabs.';
        const result = Validator.sanitizeString(input);

        expect(result).toBe(input);
      });

      it('should remove control characters', () => {
        const input = 'String with\x00null\x01control\x1fcharacters';
        const result = Validator.sanitizeString(input);

        expect(result).toBe('String withnullcontrolcharacters');
      });

      it('should enforce maximum length', () => {
        const input = 'a'.repeat(100);

        expect(() => {
          Validator.sanitizeString(input, 50);
        }).toThrow(ValidationError);
      });

      it('should throw error for non-string input', () => {
        expect(() => {
          Validator.sanitizeString(123 as any);
        }).toThrow(ValidationError);
      });
    });

    describe('validateJSON', () => {
      it('should parse valid JSON', () => {
        const jsonString = '{"key": "value", "number": 42}';
        const result = Validator.validateJSON(jsonString);

        expect(result).toEqual({ key: 'value', number: 42 });
      });

      it('should throw ValidationError for invalid JSON', () => {
        const invalidJson = '{invalid json}';

        expect(() => {
          Validator.validateJSON(invalidJson);
        }).toThrow(ValidationError);
      });
    });

    describe('validateMCPRequest', () => {
      it('should accept valid MCP request', () => {
        const validRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        };

        expect(() => {
          Validator.validateMCPRequest(validRequest);
        }).not.toThrow();
      });

      it('should reject request without jsonrpc', () => {
        const invalidRequest = {
          id: 1,
          method: 'tools/list'
        };

        expect(() => {
          Validator.validateMCPRequest(invalidRequest);
        }).toThrow(ValidationError);
      });

      it('should reject request with wrong jsonrpc version', () => {
        const invalidRequest = {
          jsonrpc: '1.0',
          id: 1,
          method: 'tools/list'
        };

        expect(() => {
          Validator.validateMCPRequest(invalidRequest);
        }).toThrow(ValidationError);
      });

      it('should reject request without method', () => {
        const invalidRequest = {
          jsonrpc: '2.0',
          id: 1
        };

        expect(() => {
          Validator.validateMCPRequest(invalidRequest);
        }).toThrow(ValidationError);
      });

      it('should reject request without id', () => {
        const invalidRequest = {
          jsonrpc: '2.0',
          method: 'tools/list'
        };

        expect(() => {
          Validator.validateMCPRequest(invalidRequest);
        }).toThrow(ValidationError);
      });
    });
  });
});
