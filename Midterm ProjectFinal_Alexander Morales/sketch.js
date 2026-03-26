// Alexander Morales - First Light of the Moon
// my project about different worlds and how they feel with shapes

// --- STATE AND ENVIRONMENT VARIABLES ---
let state = "menu"; 
let environment = 1; // 1: Normal, 2: Alien, 3: Negative, 4: Hueco Mundo
let gravity;
let fireworks = []; 
let stars = [];     
let boatX = 400;    
let t = 0;          // Time of day (0 to 1)

function setup() {
  createCanvas(800, 600);
  gravity = createVector(0, 0.15); // global gravity for the sparks

  // making some random stars for the night
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
  
  // disable right click so i can use it for the fireworks
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
  
  // draw my stars in background
  fill(255, 150);
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  fill(255);
  textSize(45);
  text("First Light of the Moon", width / 2, height / 2 - 80);
  
  // instructions for the player
  textSize(18);
  fill(200);
  text("A / D or Arrows  -  Move the boat", width / 2, height / 2 + 20);
  text("Left Click + Drag  -  Change time of day", width / 2, height / 2 + 45);
  text("Right Click  -  Launch Fireworks", width / 2, height / 2 + 70);

  // little animation for the text
  let opacity = map(sin(frameCount * 0.05), -1, 1, 50, 255);
  fill(255, 255, 255, opacity);
  textSize(22);
  text("Click anywhere to begin journey", width / 2, height / 2 + 130);
}

// --- MAIN SCENE ---
function drawScene() {
  
  // 1. WORLD TRAVEL
  // if boat go off screen, i move to next world
  if (boatX > width + 50) {
    environment++; 
    boatX = -50; 

    // reset everything if i pass the last world
    if (environment > 4) {
      state = "menu";
      environment = 1; 
      boatX = 400;     
      return;          
    }
  }

  // 2. BOAT MOVEMENT
  let bobbing = sin(frameCount * 0.05) * 10;
  let isMoving = false; 

  // check if i press keys to move
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { 
    boatX -= 3;
    isMoving = true; 
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { 
    boatX += 3;
    isMoving = true; 
  }

  // sail color change when moving
  let sailColor = isMoving ? color(0, 150, 255) : color(240);

  // time logic: mouse controls the cycle
  if (mouseIsPressed && mouseButton === LEFT) {
    t = map(mouseY, 0, height, 0, 1, true);
  }

  // 3. SKY COLORS BY ENVIRONMENT
  let skyColor;

  if (environment === 4) {
    // Hueco Mundo is always black sky
    skyColor = color(0); 
  } 
  else if (environment === 2) {
    // Alien World colors
    if (t < 0.5) {
      // morning for alien world
      skyColor = lerpColor(color(200, 50, 150), color(50, 255, 200), t * 2);
    } else {
      // night for alien world
      skyColor = lerpColor(color(50, 255, 200), color(20, 0, 40), (t - 0.5) * 2);
    }
  } 
  else {
    // Normal World and Negative World
    if (t < 0.5) {
      skyColor = lerpColor(color(135, 206, 235), color(255, 120, 0), t * 2);
    } else {
      skyColor = lerpColor(color(255, 120, 0), color(10, 10, 30), (t - 0.5) * 2);
    }
  }
  background(skyColor);

  // 4. STARS
  // stars only show when it get dark
  let starAlpha = map(t, 0.6, 1, 0, 255, true);
  fill(environment === 2 ? color(150, 255, 200, starAlpha) : color(255, starAlpha));
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  // 5. SUN AND MOON
  if (t < 0.5) {
    let sunY = map(t, 0, 0.5, height * 0.2, height * 0.8);
    drawSun(width / 2, sunY, 80);
  } else {
    let moonY = map(t, 0.5, 1, height * 0.8, height * 0.2);
    drawMoon(width / 2, moonY, 60);
  }

  // 6. FIREWORKS
  // update and clean up the array
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].done) fireworks.splice(i, 1);
  }

  // 7. DRAWING EVERYTHING
  drawLand(t);
  drawBoat(boatX, height * 0.68 + bobbing, sailColor);
  drawWaves(t);

  // arrow to tell player where to go
  let arrowAlpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
  fill(255, arrowAlpha);
  textSize(50);
  text("➔", width - 40, height / 2);

  // world 3 special effect
  if (environment === 3) filter(INVERT);
}

// --- MOUSE CLICK ---
function mousePressed() {
  if (state === "menu") {
    state = "scene";
  } else if (state === "scene") {
    // launch fireworks if is night or if im in Hueco Mundo
    if (mouseButton === RIGHT && (t > 0.4 || environment === 4)) { 
      fireworks.push(new Fireworks(mouseX, height * 0.7)); 
    }
  }
}

// --- DRAWING HELPERS ---

function drawBoat(x, y, sColor) {
  push();
  translate(x, y);
  fill(100, 50, 20); 
  noStroke();
  quad(-50, 0, 50, 0, 30, 25, -30, 25); // the boat body
  stroke(50);
  strokeWeight(3);
  line(0, 0, 0, -50); // mast for the sail
  noStroke();
  fill(sColor); 
  triangle(2, -5, 2, -45, 35, -5); // the actual sail
  pop();
}

function drawLand(t) {
  let cDay, cNight;
  
  if (environment === 4) { 
    cDay = color(240); cNight = color(180); // White sands
  } else if (environment === 2) { 
    cDay = color(150, 80, 40); cNight = color(30, 10, 20); // Alien land
  } else { 
    cDay = color(40, 60, 30); cNight = color(5, 15, 5); // Normal grass
  }
  
  let landColor = lerpColor(cDay, cNight, t);
  fill(landColor);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let h = noise(x * 0.01) * 120; // use noise for hills
    vertex(x, height * 0.7 - h);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawWaves(t) {
  let cDay, cNight;

  if (environment === 4) { 
    cDay = color(200); cNight = color(150); // Silver water
  } else if (environment === 2) {
    cDay = color(100, 20, 50); cNight = color(20, 5, 15); // Alien water
  } else {
    cDay = color(20, 40, 80); cNight = color(5, 10, 25); // Blue water
  }
  
  let waveColor = lerpColor(cDay, cNight, t);
  noStroke();
  // draw 4 layers of waves for depth
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
  if (environment === 4) {
    fill(0); stroke(255); strokeWeight(2);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
    circle(x, y, r * 2); // Black sun look
  } else {
    let grad = drawingContext.createRadialGradient(x, y, 0, x, y, r);
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
  }
  pop();
}

function drawMoon(x, y, radius) {
  push();
  let grad = drawingContext.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, '#f5f5f5');
  grad.addColorStop(1, '#bcbcbc');
  drawingContext.shadowBlur = 30;
  
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