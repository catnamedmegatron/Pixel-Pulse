import fetch from 'node-fetch'; // Vercel's Node.js environment provides fetch

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  // Ensure the API key is available
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set in Vercel environment variables.');
    return response.status(500).json({ error: 'Server configuration error: API key missing.' });
  }

  const { text } = request.body; // Get the text from the frontend

  if (!text) {
    return response.status(400).json({ error: 'Missing text input.' });
  }

  const prompt = `