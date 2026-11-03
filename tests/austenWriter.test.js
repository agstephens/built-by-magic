const {
  tokenizeText,
  buildNGramModel,
  parseNGramOrder,
  generateAustenText,
  clearCache,
} = require('../src/austenWriter');

describe('Jane Austen Writer Module', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('tokenizeText', () => {
    test('tokenizes simple sentence into words and punctuation', () => {
      const input = 'It is a truth universally acknowledged. That a single man in possession of a good fortune, must be in want of a wife!';
      const tokens = tokenizeText(input);
      expect(tokens).toContain('It');
      expect(tokens).toContain('truth');
      expect(tokens).toContain('.');
      expect(tokens).toContain('!');
    });

    test('returns empty array for invalid input', () => {
      expect(tokenizeText(null)).toEqual([]);
      expect(tokenizeText(undefined)).toEqual([]);
      expect(tokenizeText(123)).toEqual([]);
    });

    test('strips Gutenberg header and footer when present', () => {
      const text = 'HEADER *** START OF THE PROJECT GUTENBERG EBOOK PRIDE *** Actual content. *** END OF THE PROJECT GUTENBERG EBOOK *** FOOTER';
      const tokens = tokenizeText(text);
      expect(tokens).toContain('Actual');
      expect(tokens).toContain('content');
      expect(tokens).not.toContain('HEADER');
      expect(tokens).not.toContain('FOOTER');
    });
  });

  describe('buildNGramModel', () => {
    test('builds bigram model correctly', () => {
      const tokens = ['it', 'is', 'a', 'truth', '.', 'it', 'is', 'good', '.'];
      const model = buildNGramModel(tokens, 2);

      expect(model['it']).toEqual(['is', 'is']);
      expect(model['is']).toEqual(['a', 'good']);
    });

    test('builds trigram model correctly', () => {
      const tokens = ['it', 'is', 'a', 'truth', '.', 'it', 'is', 'a', 'fact', '.'];
      const model = buildNGramModel(tokens, 3);

      expect(model['it is']).toEqual(['a', 'a']);
      expect(model['is a']).toEqual(['truth', 'fact']);
    });

    test('returns empty object if tokens are fewer than n', () => {
      expect(buildNGramModel(['a'], 2)).toEqual({});
      expect(buildNGramModel(null, 2)).toEqual({});
    });
  });

  describe('parseNGramOrder', () => {
    test('parses bigram, trigram, tetragram strings and numbers correctly', () => {
      expect(parseNGramOrder('bigram')).toBe(2);
      expect(parseNGramOrder('trigram')).toBe(3);
      expect(parseNGramOrder('tetragram')).toBe(4);
      expect(parseNGramOrder(2)).toBe(2);
      expect(parseNGramOrder('3')).toBe(3);
    });

    test('throws TypeError for unsupported n-gram type', () => {
      expect(() => parseNGramOrder('unigram')).toThrow(TypeError);
      expect(() => parseNGramOrder(5)).toThrow(TypeError);
    });
  });

  describe('generateAustenText', () => {
    const mockText = 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighborhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters. My dear Mr. Bennet, said his lady to him one day, have you heard that Netherfield Park is let at last? Mr. Bennet replied that he had not. But it is, returned she; for Mrs. Long has just been here, and she told me all about it. Mr. Bennet made no answer.';

    test('generates bigram text with approximately 5 sentences from source text', async () => {
      const text = await generateAustenText('bigram', 5, mockText);
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
      const sentenceCount = (text.match(/[.!?]/g) || []).length;
      expect(sentenceCount).toBeGreaterThanOrEqual(1);
    });

    test('generates trigram text correctly from source text', async () => {
      const text = await generateAustenText('trigram', 5, mockText);
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    test('generates tetragram text correctly from source text', async () => {
      const text = await generateAustenText('tetragram', 5, mockText);
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    test('throws error for invalid n-gram type', async () => {
      await expect(generateAustenText('hexagram', 5, mockText)).rejects.toThrow(TypeError);
    });
  });
});
