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
You are an AI that summarizes emotional states based on user-written text.

You must return:
- A 4–5 sentence summary of their current mood
- A final mood tag in this exact format: Pixel Mood: [emoji]

Only use one of these emojis: 🌧️, 🌞, 🌤️, 🌪️, 💤
Do not use any other emoji.

Here is the user input:

"""${text}"""

Now analyze and respond accordingly.
  `; // FIXED: Added the missing 💤 emoji

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const result = await geminiResponse.json();
    console.log("🔍 Gemini Raw API Response from Serverless Function:", result);

    // Pass the Gemini API's response directly back to the frontend
    response.status(200).json(result);

  } catch (error) {
    console.error("❌ Error calling Gemini API from serverless function:", error);
    response.status(500).json({ error: 'Failed to analyze mood.' });
  }
}