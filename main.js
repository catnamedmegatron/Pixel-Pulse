document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze-btn");
  const outputBox = document.getElementById("output");
  const moodVisual = document.getElementById("mood-visual");

  /* -----------------------------
     Gemini API Call
  ------------------------------ */
  async function analyzeWithGemini(text) {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Serverless function error:", errorData);

        if (response.status === 429) {
          return "⏳ Gemini is rate-limited right now. Please try again in 30–60 seconds.";
        }

        return `❌ Error from server: ${
          errorData.error?.message || errorData.error || "Unknown error"
        }`;
      }

      const result = await response.json();
      console.log("🔍 Gemini Raw API Response:", result);

      const candidate = result?.candidates?.[0];
      if (!candidate) return "⚠️ Gemini responded, but no candidate returned.";

      if (candidate.content?.parts?.length) {
        return candidate.content.parts.map(p => p.text).join("\n");
      }

      return "⚠️ Gemini responded, but didn’t return usable content.";
    } catch (err) {
      console.error("❌ Error contacting Gemini:", err);
      return "❌ Unexpected error contacting Gemini.";
    }
  }

  /* -----------------------------
     Extract Pixel Mood Emoji
  ------------------------------ */
  function extractMoodEmoji(text) {
    const match = text.match(/Pixel Mood:\s*(🌧️|🌞|🌤️|🌪️|💤)/);
    return match ? match[1] : null;
  }

  /* -----------------------------
     Button Click Handler
  ------------------------------ */
  analyzeBtn.addEventListener("click", async () => {
    const reflection = document.getElementById("reflection").value.trim();
    const social = document.getElementById("social").value.trim();

    if (!reflection && !social) {
      outputBox.innerHTML =
        `<p style="color:#ff8080;">⚠️ Please enter a reflection or a social post first.</p>`;
      return;
    }

    analyzeBtn.disabled = true;
    outputBox.innerHTML =
      `<p style="color:#aaaaff;">⏳ Analyzing mood with Gemini...</p>`;
    moodVisual.innerHTML = "";

    const combinedText = `${reflection}\n\n${social}`;

    const result = await analyzeWithGemini(combinedText);
    outputBox.innerHTML = `<div class="ai-result">${result}</div>`;

    const moodEmoji = extractMoodEmoji(result);
    console.log("🎯 Extracted Mood Emoji:", moodEmoji);

    if (moodEmoji && typeof drawPixelMood === "function") {
      drawPixelMood(moodEmoji);
    } else {
      moodVisual.innerHTML = "❓ Unable to visualize mood.";
    }

    analyzeBtn.disabled = false;
  });

  /* -----------------------------
     Reveal Animations
  ------------------------------ */
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach(section => observer.observe(section));

  /* -----------------------------
     Emoji → Mood Scene
  ------------------------------ */
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
        return `${emoji}<br>Feeling something unique!`;
    }
  }
});
