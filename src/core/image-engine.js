/**
 * Image Prompt Generation & Image Fetch Engine
 */

import { callAIText, callAIImage } from './ai-client.js';

const IMAGE_STYLE_GUIDE = `
VISUAL IDENTITY & CONSTRAINTS:
- Modern Indonesian metro-pop aesthetic with vintage editorial poster styling.
- Color Palette: Muted lavender, dusty purple, mauve, soft violet, neutral shadows.
- Lighting & Atmosphere: Cinematic lighting, subtle photographic grain, moody urban atmosphere, premium book cover aesthetics.
- Setting: Authentic Indonesian urban/suburban environments (Jakarta streets, quiet alleyways, modern commuter hubs, old apartment balconies).
- Character Aesthetics: Modest clothing, Islamic-friendly, faceless or silhouetted/seen from behind or in shadow. Female characters wear elegant hijab/khimar with loose modest wardrobe.
- DILARANG/STRICTLY FORBIDDEN: Supernatural entities, ghosts, horror gore, sensual poses, explicit faces, Western architectural tropes.
`;

/**
 * Generates an English AI Image Prompt based on the story
 */
export async function generateImagePrompt({ storyTitle, storyText, updateStatus }) {
  if (updateStatus) updateStatus('Membuat prompt gambar AI...');

  const systemPrompt = `You are a professional visual art director for Indonesian urban fiction book covers.
Your task is to create a detailed, highly aesthetic image generation prompt in ENGLISH based on a short story.
Follow these visual identity constraints strictly:
${IMAGE_STYLE_GUIDE}`;

  const userPrompt = `Story Title: ${storyTitle}

Story Excerpt:
${storyText ? storyText.slice(0, 1000) : ''}

Generate a concise, highly atmospheric visual generation prompt in English (around 50-80 words).
Return ONLY JSON with this format:
{
  "prompt": "English prompt string detailing environment, subject, atmosphere, colors, photographic style..."
}`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.7
    });

    return res.prompt || `Vintage editorial poster cover, Indonesian urban environment, muted lavender and dusty purple tones, faceless silhouette of a modest figure in quiet city night, subtle film grain, cinematic lighting, modern metro-pop mystery mood.`;
  } catch (err) {
    console.warn('Fallback image prompt generation:', err);
    return `Vintage editorial poster cover, Indonesian urban environment, muted lavender and dusty purple tones, faceless silhouette of a modest figure in quiet city night, subtle film grain, cinematic lighting, modern metro-pop mystery mood.`;
  }
}

/**
 * Generates image using the prompt
 */
export async function generateStoryImage({ prompt, updateStatus }) {
  if (updateStatus) updateStatus('Menghasilkan gambar cover AI...');
  try {
    const imageUrl = await callAIImage({ prompt });
    return imageUrl;
  } catch (err) {
    console.error('Failed to generate image:', err);
    throw err;
  }
}
