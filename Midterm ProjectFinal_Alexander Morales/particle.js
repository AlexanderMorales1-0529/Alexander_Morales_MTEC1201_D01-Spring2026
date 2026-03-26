class Particle {
  constructor(x, y, vx, vy, isExplosion, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.color = c;
    this.lifespan = 255;
    this.isExplosion = isExplosion;
    this.size = isExplosion ? random(2, 5) : 8; 
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // Important: Clear forces for next frame
    
    if (this.isExplosion) {
      this.lifespan -= 4; // Fade out fragments
    }
  }

  done() {
    return this.lifespan < 0;
  }

  display() {
    push();
    // Using the alpha (lifespan) to make it disappear
    stroke(red(this.color), green(this.color), blue(this.color), this.lifespan);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
    pop();
  }
}