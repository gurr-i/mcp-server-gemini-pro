import { GoogleGenAI } from '@google/genai';
import { config } from '../../src/config/index.js';

// Skip integration tests if no API key is provided
const describeIf = (condition: boolean) => condition ? describe : describe.skip;

describeIf(!!process.env.GEMINI_API_KEY)('Gemini API Integration', () => {
  let genAI: GoogleGenAI;

  beforeAll(() => {
    genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
  });

  describe('Text Generation', () => {
    it('should generate text with gemini-2.5-flash', async () => {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          parts: [{ text: 'Say hello in exactly 3 words.' }],
          role: 'user'
        }]
      });

      expect(result).toBeDefined();
      expect(result.candidates).toBeDefined();
      expect(result.candidates!.length).toBeGreaterThan(0);
      expect(result.candidates![0].content?.parts?.[0]?.text).toBeDefined();
    }, 30000);

    it('should generate text with system instruction', async () => {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        systemInstruction: {
          parts: [{ text: 'You are a helpful assistant that always responds with exactly one word.' }]
        },
        contents: [{
          parts: [{ text: 'What is the capital of France?' }],
          role: 'user'
        }]
      });

      expect(result).toBeDefined();
      expect(result.candidates).toBeDefined();
      expect(result.candidates!.length).toBeGreaterThan(0);
      
      const responseText = result.candidates![0].content?.parts?.[0]?.text;
      expect(responseText).toBeDefined();
      expect(responseText!.trim().split(/\s+/).length).toBeLessThanOrEqual(2); // Allow for some flexibility
    }, 30000);

    it('should generate JSON output', async () => {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              answer: { type: 'string' },
              confidence: { type: 'number' }
            },
            required: ['answer', 'confidence']
          }
        },
        contents: [{
          parts: [{ text: 'What is 2+2? Respond with your answer and confidence level.' }],
          role: 'user'
        }]
      });

      expect(result).toBeDefined();
      expect(result.candidates).toBeDefined();
      
      const responseText = result.candidates![0].content?.parts?.[0]?.text;
      expect(responseText).toBeDefined();
      
      // Should be valid JSON
      const jsonResponse = JSON.parse(responseText!);
      expect(jsonResponse.answer).toBeDefined();
      expect(jsonResponse.confidence).toBeDefined();
      expect(typeof jsonResponse.confidence).toBe('number');
    }, 30000);
  });

  describe('Token Counting', () => {
    it('should count tokens for text', async () => {
      const result = await genAI.models.countTokens({
        model: 'gemini-2.5-flash',
        contents: 'This is a test message for token counting.'
      });

      expect(result).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
      expect(typeof result.totalTokens).toBe('number');
    }, 10000);

    it('should count tokens for longer text', async () => {
      const longText = 'This is a longer test message. '.repeat(100);
      const result = await genAI.models.countTokens({
        model: 'gemini-2.5-flash',
        contents: longText
      });

      expect(result).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(100); // Should be significantly more tokens
    }, 10000);
  });

  describe('Model Listing', () => {
    it('should list available models', async () => {
      const result = await genAI.models.list();

      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Array.isArray(result.models)).toBe(true);
      expect(result.models!.length).toBeGreaterThan(0);

      // Check that we have some expected models
      const modelNames = result.models!.map(model => model.name);
      expect(modelNames.some(name => name?.includes('gemini'))).toBe(true);
    }, 10000);
  });

  describe('Embeddings', () => {
    it('should generate embeddings', async () => {
      const result = await genAI.models.embedContent({
        model: 'text-embedding-004',
        contents: 'This is a test text for embedding generation.'
      });

      expect(result).toBeDefined();
      expect(result.embeddings).toBeDefined();
      expect(Array.isArray(result.embeddings)).toBe(true);
      expect(result.embeddings!.length).toBeGreaterThan(0);
      
      const embedding = result.embeddings![0];
      expect(embedding.values).toBeDefined();
      expect(Array.isArray(embedding.values)).toBe(true);
      expect(embedding.values!.length).toBeGreaterThan(0);
      
      // Check that values are numbers
      embedding.values!.forEach(value => {
        expect(typeof value).toBe('number');
      });
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should handle invalid model name', async () => {
      await expect(
        genAI.models.generateContent({
          model: 'invalid-model-name',
          contents: [{
            parts: [{ text: 'Test' }],
            role: 'user'
          }]
        })
      ).rejects.toThrow();
    }, 10000);

    it('should handle empty content', async () => {
      await expect(
        genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{
            parts: [{ text: '' }],
            role: 'user'
          }]
        })
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Rate Limiting', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{
            parts: [{ text: `Test request ${i + 1}` }],
            role: 'user'
          }]
        })
      );

      const results = await Promise.allSettled(requests);
      
      // At least some requests should succeed
      const successful = results.filter(result => result.status === 'fulfilled');
      expect(successful.length).toBeGreaterThan(0);
      
      // Check that successful results have the expected structure
      successful.forEach(result => {
        if (result.status === 'fulfilled') {
          expect(result.value.candidates).toBeDefined();
          expect(result.value.candidates!.length).toBeGreaterThan(0);
        }
      });
    }, 60000);
  });
});
