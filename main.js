document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze-btn");
  const outputBox = document.getElementById("output");  

  async function analyzeWithGemini(text) {
    try {
      // Make the fetch request to your new Vercel serverless function
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text }) // Send the user input text to your function
      });

      // Check if the serverless function itself returned an error
      if (!response.ok) {
  const errorData = await response.json();
  console.error("❌ Serverless function error:", errorData);

  if (response.status === 429) {
    return "⏳ Too many requests. Please wait a minute and try again.";
  }

  return `❌ Error from server: ${
    errorData.error?.message || errorData.error || 'Unknown error'
  }`;
}


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

      const moodEmoji = result.match(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u)?.[0] || null;
      console.log("🎯 Extracted Mood Emoji:", moodEmoji);

      if (moodEmoji) {
        drawPixelMood(moodEmoji);
      } else {
        document.getElementById("mood-visual").innerHTML = `❓ Unable to visualize mood.`;
      }

    } catch (err) {
      console.error(err);
      outputBox.innerHTML = `<p style="color:#ff6060;">❌ Error analyzing mood. Try again later.</p>`;
    }
  });

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