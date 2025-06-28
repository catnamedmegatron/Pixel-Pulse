document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze-btn");
  const outputBox = document.getElementById("output");

  const API_KEY = "YOUR_API_KEY_HERE"; // Replace this with your own Gemini API key

  async function analyzeWithGemini(text) {
    const prompt = `
You are an AI that summarizes emotional states based on user-written text.

You must return:
- A 2–3 sentence summary of their current mood
- A final mood tag in this exact format: Pixel Mood: [emoji]

Only use one of these emojis: 🌧️, 🌞, 🌤️, 🌪️, 💤
Do not use any other emoji.

Here is the user input:

"""${text}"""

Now analyze and respond accordingly.
    `;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
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

      const result = await response.json();
      console.log("🔍 Gemini Raw API Response:", result);

      const candidate = result?.candidates?.[0];
      if (!candidate) return "⚠️ Gemini responded, but no candidate returned.";

      if (candidate.content?.parts?.length) {
        return candidate.content.parts.map(p => p.text).join("\n");
      }

      if (candidate.output) return candidate.output;
      if (candidate.content?.text) return candidate.content.text;

      return "⚠️ Gemini responded, but didn’t return usable content.";

    } catch (err) {
      console.error("❌ Error parsing Gemini response:", err);
      return "❌ Unexpected error contacting Gemini.";
    }
  }

  analyzeBtn.addEventListener("click", async () => {
    const reflection = document.getElementById("reflection").value.trim();
    const social = document.getElementById("social").value.trim();

    if (!reflection && !social) {
      outputBox.innerHTML = `<p style="color:#ff8080;">⚠️ Please enter a reflection or a social post first.</p>`;
      return;
    }

    outputBox.innerHTML = `<p style="color:#aaaaff;">⏳ Analyzing mood with Gemini...</p>`;

    const combinedText = `${reflection}\n\n${social}`;

    try {
      const result = await analyzeWithGemini(combinedText);
      outputBox.innerHTML = `<div class="ai-result">${result}</div>`;

      // ✅ Extract mood emoji (after result is received)
      const moodEmoji = result.match(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u)?.[0] || null;
      console.log("🎯 Extracted Mood Emoji:", moodEmoji);

      if (moodEmoji) {
        drawPixelMood(moodEmoji); // ✅ p5.js-based mood canvas
      } else {
        document.getElementById("mood-visual").innerHTML = `❓ Unable to visualize mood.`;
      }

    } catch (err) {
      console.error(err);
      outputBox.innerHTML = `<p style="color:#ff6060;">❌ Error analyzing mood. Try again later.</p>`;
    }
  });

  // Scroll-reveal logic
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(section => {
    observer.observe(section);
  });

  // Optional: keep this for fallback text-based visuals
  function moodSceneFromEmoji(emoji) {
    switch (emoji) {
      case "🌧️":
        return "🌧️🌧️🌧️<br>☁️ You seem a bit cloudy today.";
      case "🌞":
        return "☀️🌻☀️<br>🌞 A bright and sunny mood!";
      case "🌪️":
        return "🌪️🌫️🌪️<br>😵 Feeling a bit overwhelmed?";
      case "🌤️":
        return "🌤️⛅🌤️<br>⛅ Balanced with hope.";
      case "💤":
        return "😴💤😴<br>🫥 Emotionally distant today.";
      default:
        return `${emoji} <br>Feeling something unique!`;
    }
  }
});
