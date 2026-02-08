export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return response.status(500).json({
      error: 'Server configuration error: API key missing.'
    });
  }

  const { text } = request.body;
  if (!text) {
    return response.status(400).json({
      error: 'Missing text input.'
    });
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
`;

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const result = await geminiResponse.json();
    console.log("🔍 Gemini Raw API Response:", result);

    if (!geminiResponse.ok) {
      return response.status(geminiResponse.status).json({
        error: result.error || "Gemini API error"
      });
    }

    return response.status(200).json(result);

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return response.status(500).json({
      error: 'Failed to analyze mood.'
    });
  }
}
