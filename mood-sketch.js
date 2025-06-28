let currentMood = null;

function drawPixelMood(mood) {
  currentMood = mood.normalize("NFKD");


  // Clear previous sketch
  let canvasArea = document.getElementById('mood-visual');
  canvasArea.innerHTML = "";
  new p5(p => pixelMoodSketch(p, mood), canvasArea);
}

function pixelMoodSketch(p, mood) {
    mood = mood.normalize("NFKD"); // ← normalize again here
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
  p.fill("#fff");
  p.textSize(12);
  p.text("mood: " + mood, 10, 20);

  // 🌧️ Rain mood
  if (mood === "🌧") {
    p.background("#0a0a1a");
    p.fill("#88ccff");
    for (let d of drops) {
      p.rect(d.x, d.y, 2, 10);
      d.y += d.speed;
      if (d.y > p.height) d.y = p.random(-100, 0);
    }

  // 🌞 Sunny mood
 } else if (mood === "🌞") {
  p.background("#ffe066");

  // Central pixel sun
  p.fill("#ffcc00");
  p.rect(p.width / 2 - 10, p.height / 2 - 10, 20, 20); // core square

  // Rays - 8 directional
  p.stroke("#ffaa00");
  p.strokeWeight(3);
  let cx = p.width / 2;
  let cy = p.height / 2;
  let r = 30;

  for (let i = 0; i < 8; i++) {
    let angle = p.TWO_PI * i / 8;
    let x = cx + p.cos(angle) * r;
    let y = cy + p.sin(angle) * r;
    p.line(cx, cy, x, y);
  }

  p.noStroke();
}

  // 🌪️ Stormy mood
   else if (mood === "🌪") {
    p.background("#333344");
    p.fill("#ccccff");
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(p.frameCount * 0.05);
    p.triangle(-30, -20, 30, -20, 0, 40);
    p.pop();

  // 🌤️ Mixed mood
  } else if (mood === "🌤") {
    p.background("#ccddff");
    p.fill("#ffffff");
    p.ellipse(p.width / 2 - 30, p.height / 2 - 20, 60, 40); // cloud
    p.fill("#ffdd33");
    p.circle(p.width / 2 + 30, p.height / 2 - 30, 30); // sun

  // 💤 Sleepy mood
  } else if (mood === "💤") {
    p.background("#222");
    p.fill("#bbb");
    p.textSize(32); 
    p.text("ZzZ", p.width / 2 - 30, p.height / 2);

  // ❓ Unknown mood
  } else {
    p.background("#444");
    p.fill("#fff");
    p.textSize(14);
    p.text("No visual for this mood yet.", 20, p.height / 2);
  }
};

}
