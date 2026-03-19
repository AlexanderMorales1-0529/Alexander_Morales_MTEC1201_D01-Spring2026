class Particles {
  constructor(x, y, vx, vy, isExplosion, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.color = c;
    
    // Rockets are bigger, explosion bits are smaller
    this.size = isExplosion ? random(2, 5) : 8;
    this.life = 255; // Opacity
    this.done = false;
  }

  update() {
    // Apply gravity and movement
    this.vel.add(gravity);
    this.pos.add(this.vel);
    
    // Fade out
    this.life -= 4;
    if (this.life < 0) {
      this.done = true;
    }
  }

  display() {
    push();
    // Use the color with current life (alpha)
    fill(red(this.color), green(this.color), blue(this.color), this.life);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }
}