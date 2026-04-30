let circles = [];
let squares = [];
let numElements = 9; // Number of elements in the chain

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Using HSB for vibrant colors: Hue (0-360), Saturation (100), Brightness (100)
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize objects with specific spacing
  for (let i = 0; i < numElements; i++) {
    circles.push(new Circle(i * (width / numElements), height / 2, 25, i * 10));
    squares.push(new Square(i * (width / numElements), height / 2, 20, i * 10));
  }
}

function draw() {
  // Semi-transparent background creates a "motion blur" or trail effect
  background(0, 0, 5, 0.15);
  
  // Update and render circles
  for (let c of circles) {
    c.update();
    c.display(); 
  }
  
  // Update and render squares
  for (let s of squares) {
    s.update();
    s.display();
  }
}

class Circle {
  constructor(x, y, size, hue) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hue = hue;
    this.angle = 0;
  }

  update() {
    this.angle += 0.05; // Speed of wave motion
    this.x += 3;
    
    // Wave motion calculation
    let waveY = height / 2 - 80 + sin(this.angle) * 50;
    
    // Interaction: Smoothly follow the mouse Y position if close
    let d = dist(mouseX, mouseY, this.x, waveY);
    if (d < 200) {
      // Linear interpolation (lerp) makes the movement smooth and "organic"
      this.y = lerp(waveY, mouseY - 50, map(d, 0, 200, 1, 0));
      this.size = map(d, 0, 200, 50, 25); // Get bigger when mouse is near
    } else {
      this.y = waveY;
      this.size = 25;
    }

    this.hue = (this.hue + 1) % 360;

    if (this.x > width + 50) this.x = -50;
  }

  display() {
    fill(this.hue, 80, 100);
    noStroke();
    // Glow effect using drawingContext properties
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(this.hue, 80, 100);
    ellipse(this.x, this.y, this.size);
  }
}

class Square {
  constructor(x, y, size, hue) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hue = hue;
    this.angle = PI; // Start at opposite phase
    this.rotation = 0;
  }

  update() {
    this.angle += 0.03;
    this.x += 3;
    this.rotation += 0.05; // Constant self-rotation
    
    let waveY = height / 2 + 80 + sin(this.angle) * 50;
    
    let d = dist(mouseX, mouseY, this.x, waveY);
    if (d < 200) {
      this.y = lerp(waveY, mouseY + 50, map(d, 0, 200, 1, 0));
    } else {
      this.y = waveY;
    }

    this.hue = (this.hue + 1) % 360;
    if (this.x > width + 50) this.x = -50;
  }

  display() {
    push(); // Save coordinate system
    translate(this.x, this.y); // Move origin to object position
    rotate(this.rotation); // Rotate the individual square
    fill(this.hue, 80, 100);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop(); // Restore coordinate system and prevent rotation from affecting other objects
  }
}
