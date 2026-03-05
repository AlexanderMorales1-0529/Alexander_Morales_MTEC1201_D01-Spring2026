// Alexander Morales 
// Title: First Light of the Moon
/// follow the Patt Vira tutorial to add fireworks to my original sketch of a boat at sunset. I will use the fireworks
// to add a sense of celebration and wonder to the scene, as if the boat is witnessing the first light of the moon rising 
// over the horizon. The fireworks will also create a dynamic contrast with the calm and serene atmosphere of the boat and the sunset, 
// enhancing the emotional impact of the piece. I also added the interactivity of the fireworks, allowing the viewer to launch them at night, 
// which adds an element of playfulness and engagement to the artwork.
/* Concept/Theme: I am investigating how basic geometric primitives in code can create complex emotional atmospheres. 
   This piece explores using shapes to construct a sailboat, land, the sun, and moon, testing how color gradients in the spectrum affect the viewer's sense of depth.
*/

// -------------------------------------------------------
// Controls:
// Left Click + Drag: Change time of day (moves Sun/Moon).
// Right Click: Launch fireworks (only at night).
// A / D Keys: Move the boat.

let gravity;
let fireworks = [];
let stars = [];
let boatX = 400;
let t = 0; // Global time variable (0 = day, 1 = night)

function setup() {
  createCanvas(800, 600);
  gravity = createVector(0, 0.15); // Downward force for the particle physics

  // Generate the stars once at the start
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
  
  // Disable the browser's right-click context menu
  document.oncontextmenu = function() { return false; };
}

function draw() {
  // 1. TIME LOGIC (Only changes when LEFT CLICK is held)
  if (mouseIsPressed && mouseButton === LEFT) {
    t = map(mouseY, 0, height, 0, 1, true);
  }

  // Sky color based on 't' (Day -> Sunset -> Night)
  let skyColor;
  if (t < 0.5) {
    skyColor = lerpColor(color(135, 206, 235), color(255, 120, 0), t * 2);
  } else {
    skyColor = lerpColor(color(255, 120, 0), color(10, 10, 30), (t - 0.5) * 2);
  }
  background(skyColor);

  // 2. STARS (Fade in when dark)
  let starAlpha = map(t, 0.6, 1, 0, 255, true);
  fill(255, starAlpha);
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  // 3. SUN AND MOON (Inverted mapping: Mouse up = Moon up)
  if (t < 0.5) {
    let sunY = map(t, 0, 0.5, height * 0.2, height * 0.8);
    drawSun(width / 2, sunY, 80);
  } else {
    let moonY = map(t, 0.5, 1, height * 0.8, height * 0.2);
    drawMoon(width / 2, moonY, 60);
  }

  // 4. FIREWORKS (Update and draw background fireworks)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].done) fireworks.splice(i, 1);
  }

  // 5. LANDSCAPE (Foreground)
  drawLand(t);
  
  // Boat movement and animation
  let bobbing = sin(frameCount * 0.05) * 10;
  if (keyIsPressed) {
    if (key === 'a' || key === 'A') boatX -= 3;
    if (key === 'd' || key === 'D') boatX += 3;
  }
  let sailColor = keyIsPressed ? color(0, 150, 255) : color(240);
  drawBoat(boatX, height * 0.68 + bobbing, sailColor);
  
  // 6. WAVES
  drawWaves(t);
}

function mousePressed() {
  // Launch fireworks ONLY on RIGHT CLICK
  if (mouseButton === RIGHT) {
    if (t > 0.4) { // Only allowed if it's dusk or night
      fireworks.push(new Fireworks(mouseX, height * 0.7));
    }
  }
}
// --- DRAWING FUNCTIONS ---

function drawBoat(x, y, sColor) {
  push();
  translate(x, y);
  fill(100, 50, 20); 
  noStroke();
  quad(-50, 0, 50, 0, 30, 25, -30, 25);
  stroke(50);
  strokeWeight(3);
  line(0, 0, 0, -50);
  noStroke();
  fill(sColor); 
  triangle(2, -5, 2, -45, 35, -5);
  pop();
}

function drawLand(t) {
  let landColor = lerpColor(color(40, 60, 30), color(5, 15, 5), t);
  fill(landColor);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let h = noise(x * 0.01) * 120; 
    vertex(x, height * 0.7 - h);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawSun(x, y, r) {
  push();
  let grad = drawingContext.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, 'rgba(255, 255, 0, 1)');
  grad.addColorStop(1, 'rgba(255, 60, 0, 1)');
  drawingContext.fillStyle = grad;
  noStroke();
  circle(x, y, r * 2);
  pop();
}

function drawMoon(x, y, radius) {
  push();
  let grad = drawingContext.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, '#f5f5f5');
  grad.addColorStop(1, '#bcbcbc');
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  drawingContext.fillStyle = grad;
  noStroke();
  ellipse(x, y, radius * 2); 
  pop();
}

function drawWaves(t) {
  let baseColor = color(20, 40, 80); 
  let targetColor = color(5, 10, 25);
  let waveColor = lerpColor(baseColor, targetColor, t);
  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(red(waveColor), green(waveColor), blue(waveColor), 150 + (i * 20));
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 10) {
      let noiseVal = noise(x * 0.005, frameCount * 0.01 + (i * 100));
      let waveHeight = map(noiseVal, 0, 1, -50, 50);
      let y = (height * 0.7) + (i * 30) + waveHeight;
      vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}