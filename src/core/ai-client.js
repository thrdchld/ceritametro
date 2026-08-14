/**
 * Abstraction layer for AI Text and Image Provider calls (OpenAI API Standard format)
 */

import { getSettings } from './storage.js';

/**
 * Normalizes text AI endpoint URL to ensure it ends with /chat/completions
 */
function normalizeChatEndpoint(rawEndpoint) {
  if (!rawEndpoint || !rawEndpoint.trim()) {
    return 'https://api.openai.com/v1/chat/completions';
  }
  let url = rawEndpoint.trim().replace(/\/+$/, '');
  if (url.endsWith('/chat/completions')) {
    return url;
  }
  return `${url}/chat/completions`;
}

/**
 * Normalizes image AI endpoint URL to ensure it ends with /images/generations
 */
function normalizeImageEndpoint(rawEndpoint) {
  if (!rawEndpoint || !rawEndpoint.trim()) {
    return 'https://api.openai.com/v1/images/generations';
  }
  let url = rawEndpoint.trim().replace(/\/+$/, '');
  if (url.endsWith('/images/generations')) {
    return url;
  }
  return `${url}/images/generations`;
}

/**
 * Parses JSON response from AI text completions, handling potential markdown ```json wrapping
 */
function parseAIJsonResponse(rawText) {
  if (!rawText) return null;
  
  // Clean markdown fence blocks if present
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Failed to parse AI JSON response:', err, 'Raw:', rawText);
    throw new Error('Format respon AI bukan JSON yang valid.');
  }
}

/**
 * Performs a text completion request using OpenAI standard format
 */
export async function callAIText({ systemPrompt, userPrompt, jsonMode = false, temperature = 0.7 }) {
  const settings = getSettings();

  if (!settings.apiKey) {
    throw new Error('API Key belum diisi. Silakan atur API Key di menu Pengaturan.');
  }

  const endpoint = normalizeChatEndpoint(settings.endpoint);
  const model = settings.model || 'gpt-4o-mini';

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userPrompt });

  const body = {
    model,
    messages,
    temperature
  };

  if (jsonMode) {
    // OpenAI supports response_format
    body.response_format = { type: 'json_object' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = `HTTP ${response.status}: ${response.statusText}`;
      if (response.status === 405) {
        msg = `HTTP 405 (Method Not Allowed): Endpoint '${endpoint}' menolak metode POST. Pastikan URL endpoint di menu Pengaturan sudah benar dan berakhiran '/chat/completions'.`;
      } else {
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error && errJson.error.message) {
            msg = errJson.error.message;
          }
        } catch (e) {
          if (errText) msg += ` - ${errText.slice(0, 150)}`;
        }
      }
      throw new Error(msg);
    }

    const data = await response.json();
    const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';

    if (!content) {
      throw new Error('AI mengembalikan respon kosong.');
    }

    if (jsonMode) {
      return parseAIJsonResponse(content);
    }

    return content;
  } catch (err) {
    console.error('AI Text Call Error:', err);
    throw new Error(err.message || 'Gagal menghubungi layanan AI.');
  }
}

/**
 * Performs an image generation request using OpenAI standard format
 */
export async function callAIImage({ prompt }) {
  const settings = getSettings();
  const apiKey = settings.imageApiKey || settings.apiKey;

  if (!apiKey) {
    throw new Error('API Key gambar belum diisi. Silakan atur API Key di menu Pengaturan.');
  }

  const endpoint = normalizeImageEndpoint(settings.imageEndpoint);
  const model = settings.imageModel || 'dall-e-3';

  const body = {
    model,
    prompt,
    n: 1,
    size: '1024x1024'
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = `HTTP ${response.status}: ${response.statusText}`;
      if (response.status === 405) {
        msg = `HTTP 405 (Method Not Allowed): Image Endpoint '${endpoint}' menolak metode POST. Pastikan URL endpoint di Pengaturan berakhiran '/images/generations'.`;
      } else {
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error && errJson.error.message) {
            msg = errJson.error.message;
          }
        } catch (e) {
          if (errText) msg += ` - ${errText.slice(0, 150)}`;
        }
      }
      throw new Error(msg);
    }

    const data = await response.json();
    if (data.data && data.data[0]) {
      // Returns either URL or b64_json
      const imgItem = data.data[0];
      if (imgItem.url) return imgItem.url;
      if (imgItem.b64_json) return `data:image/png;base64,${imgItem.b64_json}`;
    }

    throw new Error('Respon generasi gambar tidak berisi data gambar.');
  } catch (err) {
    console.error('AI Image Call Error:', err);
    throw new Error(err.message || 'Gagal menghasilkan gambar.');
  }
}

/**
 * Fetches available models list from OpenAI standard GET /v1/models endpoint
 */
export async function fetchAvailableModels({ endpoint, apiKey }) {
  if (!apiKey) {
    throw new Error('Isi API Key terlebih dahulu sebelum memindai model.');
  }

  let baseUrl = (endpoint || 'https://api.openai.com/v1/chat/completions').trim().replace(/\/+$/, '');
  let modelsUrl = '';
  
  if (baseUrl.endsWith('/chat/completions')) {
    modelsUrl = baseUrl.replace(/\/chat\/completions$/, '/models');
  } else if (baseUrl.endsWith('/images/generations')) {
    modelsUrl = baseUrl.replace(/\/images\/generations$/, '/models');
  } else {
    modelsUrl = `${baseUrl}/models`;
  }

  try {
    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error && errJson.error.message) msg = errJson.error.message;
      } catch (e) {
        if (errText) msg += ` - ${errText.slice(0, 100)}`;
      }
      throw new Error(msg);
    }

    const json = await response.json();
    if (json.data && Array.isArray(json.data)) {
      const list = json.data.map(m => (typeof m === 'string' ? m : m.id)).filter(Boolean);
      list.sort();
      return list;
    }

    throw new Error('Respon server tidak memiliki daftar "data" model.');
  } catch (err) {
    console.error('Fetch models error:', err);
    throw new Error(`Gagal memindai model: ${err.message}`);
  }
}


