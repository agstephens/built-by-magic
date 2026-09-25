const fs = require('fs');
const path = require('path');
const https = require('https');

const GUTENBERG_URL = 'https://www.gutenberg.org/files/1342/1342-0.txt';
const CACHE_DIR = path.join(__dirname, '../.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'pride_and_prejudice.txt');

// In-memory cache for source text, tokens, and n-gram models
let cachedRawText = null;
let cachedTokens = null;
const cachedModels = {};

/**
 * Downloads Pride and Prejudice from Project Gutenberg or loads from local cache.
 * @returns {Promise<string>} The raw text of Pride and Prejudice.
 */
function fetchOrGetSourceText() {
  if (cachedRawText) {
    return Promise.resolve(cachedRawText);
  }

  if (fs.existsSync(CACHE_FILE)) {
    try {
      cachedRawText = fs.readFileSync(CACHE_FILE, 'utf8');
      return Promise.resolve(cachedRawText);
    } catch (e) {
      // Fallback to fetch if read fails
    }
  }

  return new Promise((resolve, reject) => {
    https
      .get(GUTENBERG_URL, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to fetch text: HTTP ${res.statusCode}`));
        }
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          cachedRawText = data;
          try {
            if (!fs.existsSync(CACHE_DIR)) {
              fs.mkdirSync(CACHE_DIR, { recursive: true });
            }
            fs.writeFileSync(CACHE_FILE, data, 'utf8');
          } catch (e) {
            // Ignore write errors (e.g. read-only filesystem)
          }
          resolve(data);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

/**
 * Tokenizes text into words and sentence-ending punctuation.
 * Strips Gutenberg headers/footers if present.
 * @param {string} text - Raw text to tokenize.
 * @returns {string[]} Array of token strings.
 */
function tokenizeText(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  let cleanText = text;
  const startIdx = cleanText.indexOf('*** START OF THE PROJECT GUTENBERG EBOOK');
  const endIdx = cleanText.indexOf('*** END OF THE PROJECT GUTENBERG EBOOK');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleanText = cleanText.substring(startIdx, endIdx);
  }

  return cleanText.match(/[A-Za-z0-9]+['\u2019]?[A-Za-z0-9]*|[.!?]/g) || [];
}

/**
 * Builds an N-Gram model from a list of tokens.
 * @param {string[]} tokens - Array of text tokens.
 * @param {number} n - N-gram order (2 for bigram, 3 for trigram, 4 for tetragram).
 * @returns {Object} N-gram frequency model map.
 */
function buildNGramModel(tokens, n) {
  if (!Array.isArray(tokens) || tokens.length < n || n < 2) {
    return {};
  }

  const model = {};
  for (let i = 0; i <= tokens.length - n; i++) {
    const key = tokens
      .slice(i, i + n - 1)
      .map((t) => t.toLowerCase())
      .join(' ');
    const nextToken = tokens[i + n - 1];

    if (!model[key]) {
      model[key] = [];
    }
    model[key].push(nextToken);
  }

  return model;
}

/**
 * Normalizes N-gram type string or number to integer (2, 3, or 4).
 * @param {string|number} type - 'bigram'|2, 'trigram'|3, 'tetragram'|4.
 * @returns {number} 2, 3, or 4.
 */
function parseNGramOrder(type) {
  if (type === 2 || type === '2' || type === 'bigram') return 2;
  if (type === 3 || type === '3' || type === 'trigram') return 3;
  if (type === 4 || type === '4' || type === 'tetragram') return 4;
  throw new TypeError('Invalid n-gram type. Must be "bigram", "trigram", or "tetragram".');
}

/**
 * Formats array of tokens into a readable paragraph string.
 * @param {string[]} words - Array of word and punctuation tokens.
 * @returns {string} Formatted paragraph text.
 */
function formatParagraph(words) {
  let result = '';
  let capitalizeNext = true;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    if (['.', '!', '?'].includes(word)) {
      result += word;
      capitalizeNext = true;
    } else {
      if (capitalizeNext) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        capitalizeNext = false;
      }
      result += (result.length > 0 && !result.endsWith(' ') ? ' ' : '') + word;
    }
  }

  return result;
}

/**
 * Generates text given an N-gram model and order.
 * @param {Object} model - N-gram frequency model.
 * @param {number} n - N-gram order.
 * @param {number} [sentenceCount=5] - Target number of sentences.
 * @returns {string} Generated paragraph text.
 */
function generateTextFromModel(model, n, sentenceCount = 5) {
  const keys = Object.keys(model);
  if (keys.length === 0) {
    return '';
  }

  let currentKey = keys[Math.floor(Math.random() * keys.length)];
  const words = currentKey.split(' ');

  let sentences = 0;
  let maxTokens = 350;

  while (sentences < sentenceCount && maxTokens-- > 0) {
    const options = model[currentKey];
    if (!options || options.length === 0) {
      currentKey = keys[Math.floor(Math.random() * keys.length)];
      continue;
    }

    const nextWord = options[Math.floor(Math.random() * options.length)];
    words.push(nextWord);

    if (['.', '!', '?'].includes(nextWord)) {
      sentences++;
    }

    const keyWords = words.slice(-(n - 1)).map((w) => w.toLowerCase());
    currentKey = keyWords.join(' ');
  }

  return formatParagraph(words);
}

/**
 * Main function to generate Austen Writer paragraph.
 * @param {string|number} type - 'bigram', 'trigram', 'tetragram' (or 2, 3, 4).
 * @param {number} [sentenceCount=5] - Number of sentences to generate.
 * @param {string} [sourceText] - Optional source text override.
 * @returns {Promise<string>} Generated text paragraph.
 */
async function generateAustenText(type, sentenceCount = 5, sourceText = null) {
  const n = parseNGramOrder(type);

  let tokens;
  if (sourceText) {
    tokens = tokenizeText(sourceText);
  } else {
    if (!cachedTokens) {
      const text = await fetchOrGetSourceText();
      cachedTokens = tokenizeText(text);
    }
    tokens = cachedTokens;
  }

  let model;
  if (sourceText) {
    model = buildNGramModel(tokens, n);
  } else {
    if (!cachedModels[n]) {
      cachedModels[n] = buildNGramModel(tokens, n);
    }
    model = cachedModels[n];
  }

  return generateTextFromModel(model, n, sentenceCount);
}

/**
 * Clears in-memory caches.
 */
function clearCache() {
  cachedRawText = null;
  cachedTokens = null;
  Object.keys(cachedModels).forEach((k) => delete cachedModels[k]);
}

module.exports = {
  fetchOrGetSourceText,
  tokenizeText,
  buildNGramModel,
  parseNGramOrder,
  generateAustenText,
  formatParagraph,
  clearCache,
};
