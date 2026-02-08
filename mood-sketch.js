let currentMood = null;
let sketchInstance = null;

function drawPixelMood(mood) {
  const normalizedMood = mood.normalize("NFKD");
  currentMood = normalizedMood;

  const canvasArea = document.getElementById("mood-visual");
  canvasArea.innerHTML = "";

  if (sketchInstance) {
    sketchInstance.remove();
    sketchInstance = null;
  }

  sketchInstance = new p5(p => pixelMoodSketch(p, normalizedMood), canvasArea);
}

function pixelMoodSketch(p, mood) {
  let drops = [];

  p.setup = function () {
    p.createCanvas(300, 200);
    p.noStroke();

    if (mood === "🌧") {
      for (let i = 0; i < 80; i++) {
        drops.push({
          x: p.random(p.width),
          y: p.random(-200, 0),
          speed: p.random(2, 5)
        });
      }
    }
  };

  p.draw = function () {
    const bounceOffset = Math.sin(p.frameCount * 0.05) * 3;

    // 🌧️ Rain mood
    if (mood === "🌧") {
      p.background("#0a0a1a");

      const cx = p.width / 2;
      const cy = 35 + bounceOffset;
      const sz = 16;

      // Top highlights
      p.fill("#ffffff");
      [
        [-2, -2], [-1, -2], [0, -2], [1, -2]
      ].forEach(([dx, dy]) => {
        p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
      });

      // Main cloud
      p.fill("#e0e0e0");
      [
        [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1],
        [-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
        [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1]
      ].forEach(([dx, dy]) => {
        p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
      });

      // Shadow
      p.fill("#b0b0b0");
      [
        [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]
      ].forEach(([dx, dy]) => {
        p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
      });

      // Rain drops
      p.fill("#66ccff");
      for (let d of drops) {
        p.rect(d.x, d.y, 2, 8);
        d.y += d.speed;
        if (d.y > p.height) d.y = p.random(-20, 0);
      }
    }

    // 🌞 Sunny mood
    else if (mood === "🌞") {
      p.background("#a0c8ff");

      const cx = p.width / 2;
      const cy = p.height / 2;
      const sz = 12;

      // Outline
      p.fill("#cc9b00");
      for (let y = -2; y <= 2; y++) {
        for (let x = -2; x <= 2; x++) {
          if (Math.abs(x) === 2 || Math.abs(y) === 2) {
            p.rect(cx + x * sz, cy + y * sz, sz, sz);
          }
        }
      }

      // Glow
      p.fill("#ffd633");
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          p.rect(cx + x * sz, cy + y * sz, sz, sz);
        }
      }

      // Core
      p.fill("#ffff99");
      p.rect(cx, cy, sz, sz);

      // Rays
      p.fill("#ffcc00");
      [
        [0, -3], [0, 3], [3, 0], [-3, 0],
        [2, -2], [2, 2], [-2, -2], [-2, 2]
      ].forEach(([dx, dy]) => {
        const pulse = Math.sin((p.frameCount + dx + dy) * 0.15) * 4;
        p.rect(cx + dx * sz, cy + dy * sz + pulse, sz, sz);
      });
    }

    // 🌪️ Storm mood
    else if (mood === "🌪") {
      p.background("#1a1a2a");

      const cx = p.width / 2;
      let cy = p.height / 2 + 30;
      const sz = 6;
      const layers = 7;

      for (let i = 0; i < layers; i++) {
        const y = cy - i * sz;
        const widthFactor = Math.floor(p.map(i, 0, layers - 1, 1, 5));
        const offset = Math.sin(p.frameCount * 0.1 + i * 0.5) * 6;

        for (let x = -widthFactor; x <= widthFactor; x++) {
          p.fill(i % 2 === 0 ? "#888" : "#aaa");
          p.rect(cx + x * sz + offset, y, sz, sz);
        }
      }

      // Wind streaks
      p.stroke("#ddddff");
      p.strokeWeight(2.5);
      for (let i = 0; i < 15; i++) {
        const y = (i * 12 + p.frameCount * 2) % p.height;
        const x = (p.frameCount * 4 + i * 20) % p.width;
        p.line(x, y, x + 12, y);
      }
      p.noStroke();

      // Lightning
      if (p.frameCount % 90 < 6) {
        p.fill(255, 255, 255, 100);
        p.rect(0, 0, p.width, p.height);

        p.stroke("#ffffcc");
        p.strokeWeight(3);
        const bx = p.width / 2 + p.random(-20, 20);
        p.line(bx, 0, bx - 10, 40);
        p.line(bx - 10, 40, bx + 5, 80);
        p.line(bx + 5, 80, bx - 8, 130);
        p.noStroke();
      }
    }

    // 🌤️ Partly cloudy
    else if (mood === "🌤") {
      p.background("#ccddff");

      const cx = p.width / 2;
      const cy = p.height / 2 - 10;
      const sz = 8;

      // Sun
      p.fill("#ffd966");
      p.rect(cx + 12, cy - 4, sz, sz);
      p.fill("#ffff99");
      p.rect(cx + 12, cy - 4, sz / 2, sz / 2);

      // Cloud
      p.fill("#ffffff");
      [
        [-4, 1], [-3, 0], [-2, -1], [-1, -1], [0, -2],
        [1, -1], [2, -1], [3, 0], [4, 1],
        [-3, 2], [-2, 2], [-1, 3], [0, 3], [1, 3], [2, 2], [3, 2]
      ].forEach(([dx, dy]) => {
        p.rect(cx - 20 + dx * sz, cy + dy * sz, sz, sz);
      });
    }

    // 💤 Sleepy
    else if (mood === "💤") {
      p.background("#222");
      p.fill("#bbb");
      p.textSize(32);
      p.text("ZzZ", p.width / 2 - 30, p.height / 2);
    }

    // Fallback
    else {
      p.background("#444");
      p.fill("#fff");
      p.textSize(14);
      p.text("No visual for this mood yet.", 20, p.height / 2);
    }
  };
}
