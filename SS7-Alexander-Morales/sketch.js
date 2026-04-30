/* NAME: Alexander Morales
  PROJECT: Final Project Sketch (Initial Movement & Environment)
  DESCRIPTION: This is a preliminary sketch using Object-Oriented Programming (OOP). 
  It uses a 'Character' class to handle movement, state, and screen boundaries. 
  CREDITS: Assisted by tutorials from Kenny Yip Coding.
*/

let mateoSheet; 
let bgImage; 
let mateo;      

function preload() {
  // Load assets from the 'images' folder
  mateoSheet = loadImage('images/mateo.png'); 
  bgImage = loadImage('images/background.png'); 
}

function setup() {
  // Set canvas size for the village background
  createCanvas(800, 640);
  
  // Initialize Mateo at the center of the screen
  mateo = new Character(width / 2, height / 2, mateoSheet);
  
  // Keeps the pixel art sharp and crisp
  noSmooth(); 
}

function draw() {
  // 1. Draw the Background FIRST (Bottom Layer)
  image(bgImage, 0, 0, width, height);

  // 2. Update character logic (Movement and view switching)
  mateo.update();
  
  // 3. Render the character on top of the background
  mateo.display();
}

// --- CHARACTER CLASS ---
class Character {
  constructor(startX, startY, img) {
    this.img = img;
    this.x = startX;
    this.y = startY;
    
    // Display size on the canvas
    this.w = 90; 
    this.h = 90; 
    this.speed = 5;

    // --- REFINED CROPPING PARAMETERS ---
    // These numbers are strictly set to remove "WALK", "STILL", and grid lines
    this.sw = 90;   // Tight width to exclude side columns
    this.sh = 110;  // Tight height to cut out text above the head
    this.sy = 235;  // Starts further down to skip the "STILL/WALK" labels
    this.sx = 100;  // Initial Front View column
  }

  update() {
    // Check keys to move X/Y and update the source-X (sx) for the view
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
      this.sx = 100;   // Column 1: Front View
    } 
    else if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
      this.sx = 350;   // Column 2: Back View
    } 
    else if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.sx = 600;   // Column 3: Left View
    } 
    else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.sx = 850;   // Column 4: Right View
    }

    // SCREEN LIMITS: Keep Mateo inside the village
    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
  }

  display() {
    /* image(img, dx, dy, dw, dh, sx, sy, sw, sh)
       This crops the exact Mateo sprite and places him on the background.
    */
    image(this.img, this.x, this.y, this.w, this.h, this.sx, this.sy, this.sw, this.sh);
  }
}