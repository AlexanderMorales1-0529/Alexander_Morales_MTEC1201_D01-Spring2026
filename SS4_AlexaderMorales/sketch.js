///Alexander Morales
/// This sketch creates a blinking light effect using the millis() function to control the timing of the blinks. 
// The chair image is displayed at full opacity, while the light image blinks on and off based on the specified interval. 
// The text "FLASHES OF MEMORY" is displayed when the light is on.

let chair;
let light;

// Controls for the blinking and transparency effects
let lightIsOn = true;
// Change blink interval to milliseconds (e.g., 500ms = 0.5 seconds)
let blinkIntervalMillis = 1500; // Time between blinks in milliseconds
let lastBlinkTime = 0; // To store the time of the last blink
let lightOpacity = 128; // Transparency: 0 is transparent, 255 is opaque.

function preload() {
  chair = loadImage("images/chair.png");
  light = loadImage("images/light.png");
}

function setup() {
  createCanvas(600, 500);
  // Initialize lastBlinkTime when the sketch starts
  lastBlinkTime = millis();
}

function draw() {
  background(0);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(24);



  // Always draw the chair at full opacity
  noTint(); 
  image(chair, width / 2, height / 2);

  // --- Timed Event using millis() ---
  // Check if enough time (blinkIntervalMillis) has passed since the last blink
  if (millis() - lastBlinkTime >= blinkIntervalMillis) {
    lightIsOn = !lightIsOn; // Toggle between true and false
    lastBlinkTime = millis(); // Update lastBlinkTime to the current time
  }
  // ----------------------------------

  // Draw the light only when lightIsOn is true
  if (lightIsOn) {
    // Apply transparency to the light
    tint(255, 255, 255, lightOpacity); 
    image(light, width / 3 + 100, height / 1.5); // Position the light slightly to the right of the chair
    text("FLASHES OF MEMORY", width / 2, height - 50)
  }
}