//Alexander Morales 
//Title: First Light of the Moon
   /*Concept/Theme: I am investigating how basic geometric primitives in code can create complex emotional atmospheres. 
   This piece explores using shapes to construct a sailboat, land, the sun, and moon, testing how color gradients in the spectrum affect the viewer's sense of depth.
  .*/ 
let stars = [];

function setup() {
  createCanvas(800, 600);
  // generate the stars in the beginning
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
}

function draw() {
  // 1. colors base on the location of the mouse [00:00:02]
  // 't' goes from 0 (up) to 1 (down)
  let t = map(mouseY, 0, height, 0, 1, true);

  // Colors: light blue -> orange -> dark blue/black (function to blend colors) [00:00:05]
  let skyColor;
  if (t < 0.5) {
    skyColor = lerpColor(color(135, 206, 235), color(255, 120, 0), t * 2);
  } else {
    skyColor = lerpColor(color(255, 120, 0), color(10, 10, 30), (t - 0.5) * 2);
  }
  background(skyColor);

  // 2. draw stars (only visible when it gets dark) [00:00:06]
  let starAlpha = map(t, 0.6, 1, 0, 255, true);
  fill(255, starAlpha);
  noStroke();
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  // 3. Draw sun/moon [00:00:10]
  // the position of the sun is inverse to the mouse
  if (t < 0.5) {
    // Sun logic: moves from top to horizon
    let sunY = map(t, 0, 0.5, height * 0.2, height * 0.8);
    drawSun(width / 2, sunY, 80);
  } else {
    // Moon logic: moves from horizon to top
    let moonY = map(t, 0.5, 1, height * 0.8, height * 0.2);
    drawMoon(width / 2, moonY, 60);
  }

  // 4. Draw land (horizon silhouette)
  drawLand(t);

  // 5. Draw boat with interaction
  // Use sin() to animate the vertical movement (bobbing)
  let bobbing = sin(frameCount * 0.05) * 10;
  
  // Interaction using mouseIsPressed: Boat follows the mouse horizontal position
  let boatX = width * 0.3;
  if (mouseIsPressed) {
    boatX = mouseX;
  }

  // Interaction using keyIsPressed: Sail changes to color (0, 150, 255)
  let sailColor = color(240); // Default white
  if (keyIsPressed) {
    sailColor = color(0, 150, 255);
  }

  drawBoat(boatX, height * 0.68 + bobbing, sailColor);

  // 6. draw waves
  drawWaves(t);
}

function drawBoat(x, y, sColor) {
  push();
  translate(x, y);
  
  // Hull
  fill(100, 50, 20); 
  noStroke();
  quad(-50, 0, 50, 0, 30, 25, -30, 25);
  
  // Mast
  stroke(50);
  strokeWeight(3);
  line(0, 0, 0, -50);
  
  // Sail
  noStroke();
  fill(sColor); 
  triangle(2, -5, 2, -45, 35, -5);
  
  pop();
}

function drawLand(t) {
  // Land color becomes darker depending on 't'
  let landColor = lerpColor(color(40, 60, 30), color(5, 15, 5), t);
  fill(landColor);
  noStroke();

  beginShape();
  // Start point bottom left
  vertex(0, height);
  
  // Generate the land silhouette with Perlin noise
  for (let x = 0; x <= width; x += 10) {
    let h = noise(x * 0.01) * 120; 
    vertex(x, height * 0.7 - h);
  }
  
  // Close the shape
  vertex(width, height);
  endShape(CLOSE);
}

function drawSun(x, y, r) {
  push();
  let ctx = drawingContext;
  let grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  
  // Yellow/Orange gradient for the sun
  grad.addColorStop(0, 'rgba(255, 255, 0, 1)');
  grad.addColorStop(1, 'rgba(255, 60, 0, 1)');
  
  ctx.fillStyle = grad;
  noStroke();
  circle(x, y, r * 2);
  pop();
}

function drawMoon(x, y, radius) {
  push();
  let ctx = drawingContext; // we access the underlying canvas context to create gradients and shadows
  
  // 1. create a radial gradient for the moon to give it a more 3D look
  let grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, '#f5f5f5');   // white in the center
  grad.addColorStop(0.7, '#dcdcdc'); // grey in the middle
  grad.addColorStop(1, '#bcbcbc');   // darker grey on the edges
  
  // 2. configure shadow to create a glowing effect around the moon
  ctx.shadowBlur = 30;               // glows around the moon
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'; // soft white glow
  
  // 3. draw the moon with the gradient fill
  ctx.fillStyle = grad;
  noStroke();
  ellipse(x, y, radius * 2); 
  
  pop();
}

function drawWaves(t) {
  // color of the water becomes transparent depending on the mouse position 't' (on the mouse)
  // [00:00:20] turn in to a color between blue and black, the more down the mouse is, the darker the water becomes
  let baseColor = color(20, 40, 80); 
  let targetColor = color(5, 10, 25);
  let waveColor = lerpColor(baseColor, targetColor, t);
  
  noStroke();

  // We draw 4 layers of waves to give depth [00:00:15]
  for (let i = 0; i < 4; i++) {
    // Each layer is a bit darker and higher than the previous one
    fill(red(waveColor), green(waveColor), blue(waveColor), 150 + (i * 20));
    
    beginShape();
    // Initial point bottom left
    vertex(0, height);
    
    // generate the wave with Perlin noise to create a natural wave pattern
    for (let x = 0; x <= width; x += 10) {
      // changes the wave pattern over time and across the x-axis, creating a natural wave motion
      let noiseVal = noise(x * 0.005, frameCount * 0.01 + (i * 100));
      let waveHeight = map(noiseVal, 0, 1, -50, 50);
      
      // vertical position of the wave, base + waveHeight
      let y = (height * 0.7) + (i * 30) + waveHeight;
      
      vertex(x, y);
    }
    
    // close the shape in the right down side
    vertex(width, height);
    endShape(CLOSE);
  }
}