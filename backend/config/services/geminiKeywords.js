require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function buildPrompt(name, description) {
  return `You are a search-keyword generator for a local marketplace app called NIJI.
Given a product's name and description, generate a list of search keywords
that shoppers might type when looking for this product.

Rules:
- Include the product name itself and its individual meaningful words
- Include synonyms and common alternate names (e.g. "curd" for "yogurt")
- Include the general category/type of product (e.g. "vegetable", "dairy", "stationery")
- Include relevant attributes mentioned in the description (e.g. "organic", "handmade", "waterproof")
- Do NOT include generic filler words (e.g. "the", "with", "for")
- Return 5-15 keywords, lowercase, no duplicates

Respond with ONLY a JSON array of strings, no other text, no markdown formatting.

Product name: ${name}
Product description: ${description || 'No description provided'}`;
}

async function generateKeywords(name, description) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(name, description) }] }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini returned no text content');
  }

  // Defensive cleanup: strip markdown code fences if Gemini adds them anyway
  const cleaned = rawText.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();

  let keywords;
  try {
    keywords = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Gemini response as JSON: ${cleaned}`);
  }

  if (!Array.isArray(keywords)) {
    throw new Error('Gemini response was not an array');
  }

  return keywords;
}

module.exports = { generateKeywords };