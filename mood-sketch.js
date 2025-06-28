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
    let bounceOffset = Math.sin(p.frameCount * 0.05) * 3; // smooth float

  p.fill("#fff");
  p.textSize(12);
  p.text("mood: " + mood, 10, 20);

  // 🌧️ Rain mood
  if (mood === "🌧") {
    p.background("#0a0a1a");

let bounceOffset = Math.sin(p.frameCount * 0.05) * 3;
p.noStroke();
let cx = p.width / 2;
let cy = 35 + bounceOffset;
let sz = 16;

// Highlight layer (top puffs)
p.fill("#ffffff");
let topLayer = [
  [-2, -2], [-1, -2], [0, -2], [1, -2]
];
topLayer.forEach(([dx, dy]) => {
  p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
});

// Main body (puffy mid-section)
p.fill("#e0e0e0");
let bodyLayer = [
  [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1],
  [-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
  [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1]
];
bodyLayer.forEach(([dx, dy]) => {
  p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
});

// Shadow (bottom edge)
p.fill("#b0b0b0");
let shadowLayer = [
  [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]
];
shadowLayer.forEach(([dx, dy]) => {
  p.rect(cx + dx * sz, cy + dy * sz, sz, sz);
});



// Animate pixel raindrops
p.fill("#66ccff");
for (let d of drops) {
  p.rect(d.x, d.y, 2, 8);
  d.y += d.speed;
  if (d.y > p.height) d.y = p.random(-20, 0);
}


  // 🌞 Sunny mood
 } else if (mood === "🌞") {
  p.background("#a0c8ff");  // Soft sky blue background

  let cx = p.width / 2;
  let cy = p.height / 2;
  let sz = 12;

  // 🔹 1. Outline layer (dark border)
  p.fill("#cc9b00");
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      if (Math.abs(x) === 2 || Math.abs(y) === 2) {
        p.rect(cx + x * sz, cy + y * sz, sz, sz);
      }
    }
  }

  // 🔹 2. Main glow (mid-tone)
  p.fill("#ffd633");
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      p.rect(cx + x * sz, cy + y * sz, sz, sz);
    }
  }

  // 🔹 3. Core (brightest center)
  p.fill("#ffff99");
  p.rect(cx, cy, sz, sz);

  // 🔹 4. Jagged rays with shine animation
  let rayDirs = [
    [0, -3], [0, 3], [3, 0], [-3, 0], [2, -2], [2, 2], [-2, -2], [-2, 2]
  ];
  rayDirs.forEach(([dx, dy]) => {
    let pulse = Math.sin((p.frameCount + dx + dy) * 0.15) * 4;
    p.fill("#ffcc00");
    p.rect(cx + dx * sz, cy + dy * sz + pulse, sz, sz);
  });
}

  // 🌪️ Stormy mood
   else if (mood === "🌪") {
  p.background("#1a1a2a"); // dark stormy sky

  let cx = p.width / 2;
  let cy = p.height / 2 + 30; // move tornado down a bit
  let sz = 6;
  let layers = 7;

  // Tornado layers from bottom (small) to top (wide)
  p.noStroke();
  for (let i = 0; i < layers; i++) {
    let y = cy - i * sz; // each layer goes up
    let widthFactor = Math.floor(p.map(i, 0, layers - 1, 1, 5));
    let offset = Math.sin(p.frameCount * 0.1 + i * 0.5) * 6;

    for (let x = -widthFactor; x <= widthFactor; x++) {
      p.fill(i % 2 === 0 ? "#888" : "#aaa");
      p.rect(cx + x * sz + offset, y, sz, sz);
    }
  }

  // Flickering top cloud above tornado
  if (p.frameCount % 10 < 5) {
    p.fill("#444");
    for (let x = -6; x <= 6; x++) {
      p.rect(cx + x * sz, cy - layers * sz - sz, sz, sz);
    }
    // 💨 Improved animated wind streaks
p.stroke("#ddddff");
p.strokeWeight(2.5);
for (let i = 0; i < 15; i++) {
  let y = (i * 12 + p.frameCount * 2) % p.height;
  let xStart = (p.frameCount * 4 + i * 20) % p.width;
  p.line(xStart, y, xStart + 12, y);
}
p.noStroke();

// ⚡ Lightning flash effect
if (p.frameCount % 90 < 6) {
  // Flash screen tint
  p.fill(255, 255, 255, 100); // semi-transparent white
  p.rect(0, 0, p.width, p.height);

  // Flash bolt
  p.stroke("#ffffcc");
  p.strokeWeight(3);
  let boltX = p.width / 2 + p.random(-20, 20);
  p.line(boltX, 0, boltX - 10, 40);
  p.line(boltX - 10, 40, boltX + 5, 80);
  p.line(boltX + 5, 80, boltX - 8, 130);
  p.noStroke();
}
// 🚨 Tornado Warning Banner — 3s steady, then 3 blinks, then repeat
let frameInCycle = p.frameCount % 240;
let showBanner = false;

if (frameInCycle < 180) {
  // First 3 seconds (frames 0–179): show steadily
  showBanner = true;
} else if (frameInCycle >= 180 && frameInCycle < 240) {
  // Next 1 second (frames 180–239): blink every 10 frames
  let blinkFrame = frameInCycle - 180;
  showBanner = (Math.floor(blinkFrame / 10) % 2 === 0);
}

if (showBanner) {
  p.fill("#ff0033");
  p.stroke("#ffffff");
  p.strokeWeight(2);
  p.rect(p.width / 2 - 80, p.height - 40, 160, 28, 6);
  p.noStroke();

  p.fill("#ffffff");
  p.textSize(10);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("⚠️ TORNADO WARNING ⚠️", p.width / 2, p.height - 26);
}

  }

  } else if (mood === "🌤") {
  p.background("#ccddff"); // sky background

  const centerX = p.width / 2;
  const centerY = p.height / 2 - 10;
  const sz = 8;

  // ✅ New cleaner pixel cloud
p.fill("#ffffff");
p.stroke("#aaaaaa");
p.strokeWeight(1);

const size = 8;
const cx = centerX - 20;
const cy = centerY;

const cloudShape = [
  [-4, 1], [-3, 0], [-2, -1], [-1, -1], [0, -2], [1, -1], [2, -1], [3, 0], [4, 1],
  [-3, 2], [-2, 2], [-1, 3], [0, 3], [1, 3], [2, 2], [3, 2]
];

for (let [dx, dy] of cloudShape) {
  p.rect(cx + dx * size, cy + dy * size, size, size);
}

p.noStroke();


  // Sun (behind cloud)
  p.fill("#ffd966"); // mid tone
  p.stroke("#cc9b00"); // outline
  cloudCoords.slice(0, 5).forEach(([dx, dy]) => {
    p.rect(centerX + dx * sz + 12, centerY + dy * sz - 4, sz, sz);
  });

  // Sun core (brightest)
  p.fill("#ffff99");
  p.rect(centerX + 12, centerY - 4, sz, sz);

  p.noStroke();

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
