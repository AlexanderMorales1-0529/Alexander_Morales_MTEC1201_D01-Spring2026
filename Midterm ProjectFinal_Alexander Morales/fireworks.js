class Fireworks {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, random(-13, -9)); // Speed going UP
    this.explode = false;
    this.done = false;
    
    // Environment-based coloring
    if (environment === 4) {
      this.color = color(255); // White for Hueco Mundo
    } else if (environment === 2) {
      this.color = color(random(100, 255), 255, random(100, 255)); 
    } else {
      this.color = color(random(255), random(255), random(255)); 
    }

    // Create the initial rocket
    this.rocket = new Particle(this.pos.x, this.pos.y, this.vel.x, this.vel.y, false, this.color);
    this.particles = [];
  }

  update() {
    if (!this.explode) {
      this.rocket.applyForce(gravity);
      this.rocket.update();
      // When it stops going up, EXPLODE
      if (this.rocket.vel.y >= 0) {
        this.exploded();
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
      if (this.particles.length === 0) this.done = true;
    }
  }

  display() {
    if (!this.explode) {
      this.rocket.display();
    } else {
      for (let p of this.particles) p.display();
    }
  }

  exploded() {
    this.explode = true;
    for (let i = 0; i < 60; i++) {
      let pVel = p5.Vector.random2D().mult(random(2, 7));
      // Create fragments
      this.particles.push(new Particle(this.rocket.pos.x, this.rocket.pos.y, pVel.x, pVel.y, true, this.color));
    }
  }
}