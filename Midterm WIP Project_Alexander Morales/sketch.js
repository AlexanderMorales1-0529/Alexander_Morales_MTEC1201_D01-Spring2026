// Controls:
// Left Click + Drag: Change time of day (moves Sun/Moon).
// Right Click: Launch fireworks (only at night).
// A / D Keys: Move the boat.

// --- STATE AND ENVIRONMENT VARIABLES ---
let state = "menu"; 
let environment = 1; // 1: Normal, 2: Alien/Different, 3: Negative, 4: Dark

let gravity;
let fireworks = [];
let stars = [];
let boatX = 400;
let t = 0; 

function setup() {
  createCanvas(800, 600);
  gravity = createVector(0, 0.15); 

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
  
  document.oncontextmenu = function() { return false; };
  textAlign(CENTER, CENTER);
}

function draw() {
  if (state === "menu") {
    drawMenu();
  } else if (state === "scene") {
    drawScene();
  }
}

// --- START SCREEN ---
function drawMenu() {
  background(10, 10, 30); 
  
  fill(255, 150);
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  fill(255);
  textSize(45);
  text("First Light of the Moon", width / 2, height / 2 - 40);
  
  let opacity = map(sin(frameCount * 0.05), -1, 1, 50, 255);
  fill(255, 255, 255, opacity);
  textSize(18);
  text("Click to start\nUse 'A' and 'D' to navigate", width / 2, height / 2 + 40);
}

// --- SCENE AND TRAVEL LOGIC ---
function drawScene() {
  
  // 1. ENVIRONMENT TRANSITION CONTROL
  // If the boat exits on the right (with a 50px margin so it fully exits)
  if (boatX > width + 50) {
    environment++; // Move to the next environment
    boatX = -50;   // The boat reappears on the left

    // If we pass environment 4, return to the menu
    if (environment > 4) {
      state = "menu";
      environment = 1; // Reset to the original environment
      boatX = 400;     // Put the boat in the center for next time
      return;          // Exit the draw function for this frame
    }
  }

  // --- BOAT MOVEMENT ---
  let bobbing = sin(frameCount * 0.05) * 10;
  let isMoving = false; // We start assuming the boat is still

  // 65 is 'A', 68 is 'D'. I also added the Left/Right arrows as a backup!
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { 
    boatX -= 3;
    isMoving = true; // The boat is moving left
  }
  
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { 
    boatX += 3;
    isMoving = true; // The boat is moving right
  }

  // Update sail color based on the isMoving variable
  let sailColor = isMoving ? color(0, 150, 255) : color(240);

  // 3. RENDERING ENVIRONMENT 4 (PITCH BLACK)
  if (environment === 4) {
    background(0); // Completely black background
    // Draw only the boat so the user knows where it is and can exit
    drawBoat(boatX, height * 0.68 + bobbing, color(100)); // Darker and ghostlier boat
    return; // Stop the rest of the drawing for this environment
  }

  // --- RENDERING ENVIRONMENTS 1, 2 AND 3 ---

  // Time logic
  if (mouseIsPressed && mouseButton === LEFT) {
    t = map(mouseY, 0, height, 0, 1, true);
  }

  // Sky colors depending on the environment
  let skyColor;
  if (environment === 2) {
    // Environment 2: Fantasy / Alien Colors (Purples, Greens)
    if (t < 0.5) {
      skyColor = lerpColor(color(200, 50, 150), color(50, 255, 200), t * 2);
    } else {
      skyColor = lerpColor(color(50, 255, 200), color(20, 0, 40), (t - 0.5) * 2);
    }
  } else {
    // Environment 1 and 3 (3 uses normal colors and then inverts the screen)
    if (t < 0.5) {
      skyColor = lerpColor(color(135, 206, 235), color(255, 120, 0), t * 2);
    } else {
      skyColor = lerpColor(color(255, 120, 0), color(10, 10, 30), (t - 0.5) * 2);
    }
  }
  background(skyColor);

  // Stars 
  let starAlpha = map(t, 0.6, 1, 0, 255, true);
  fill(environment === 2 ? color(150, 255, 200, starAlpha) : color(255, starAlpha));
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  // Sun and Moon 
  if (t < 0.5) {
    let sunY = map(t, 0, 0.5, height * 0.2, height * 0.8);
    drawSun(width / 2, sunY, 80);
  } else {
    let moonY = map(t, 0.5, 1, height * 0.8, height * 0.2);
    drawMoon(width / 2, moonY, 60);
  }

  // Fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].done) fireworks.splice(i, 1);
  }

  // Terrain and Waves (we pass the environment so they change color)
  drawLand(t);
  
  // Draw the boat
  drawBoat(boatX, height * 0.68 + bobbing, sailColor);
  
  // Draw the waves over the base of the boat
  drawWaves(t);

  // ENVIRONMENT 3: NEGATIVE EFFECT
  // The magic of p5.js: filter(INVERT) instantly inverts all pixels on the screen
  if (environment === 3) {
    filter(INVERT);
  }
}

// --- CLICK INTERACTION ---
function mousePressed() {
  if (state === "menu") {
    state = "scene";
  } else if (state === "scene" && environment !== 4) {
    // Prevent launching fireworks in the completely dark environment
    if (mouseButton === RIGHT && t > 0.4) { 
      // (Make sure to have your Fireworks class down below in your actual code)
      fireworks.push(new Fireworks(mouseX, height * 0.7)); 
    }
  }
}

// --- MODIFIED DRAWING FUNCTIONS ---

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
  // Change land color according to the environment
  let cDay = (environment === 2) ? color(150, 80, 40) : color(40, 60, 30);
  let cNight = (environment === 2) ? color(30, 10, 20) : color(5, 15, 5);
  
  let landColor = lerpColor(cDay, cNight, t);
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

function drawWaves(t) {
  // Change wave color according to the environment
  let cDay = (environment === 2) ? color(100, 20, 50) : color(20, 40, 80);
  let cNight = (environment === 2) ? color(20, 5, 15) : color(5, 10, 25);
  
  let waveColor = lerpColor(cDay, cNight, t);
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

function drawSun(x, y, r) {
  push();
  let grad = drawingContext.createRadialGradient(x, y, 0, x, y, r);
  // A greenish/bluish sun for the alien world (Environment 2)
  if (environment === 2) {
    grad.addColorStop(0, 'rgba(50, 255, 100, 1)');
    grad.addColorStop(1, 'rgba(0, 150, 200, 1)');
  } else {
    grad.addColorStop(0, 'rgba(255, 255, 0, 1)');
    grad.addColorStop(1, 'rgba(255, 60, 0, 1)');
  }
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
  
  // Purple shadow for the different world
  if (environment === 2) {
    drawingContext.shadowColor = 'rgba(200, 100, 255, 0.5)';
  } else {
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
  }
  
  drawingContext.fillStyle = grad;
  noStroke();
  ellipse(x, y, radius * 2); 
  pop();
}

// IMPORTANT: Remember to paste your "class Fireworks { ... }" at the end of this file.