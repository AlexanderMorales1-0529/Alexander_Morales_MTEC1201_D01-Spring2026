class Fireworks {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Initial shoot upward
    this.vel = createVector(0, random(-14, -10));
    this.explode = false;
    this.done = false;
    
    // Pick a random color for the whole firework
    this.color = color(random(255), random(255), random(255));
    
    // Single rocket particle
    this.fireworkRocket = new Particles(this.pos.x, this.pos.y, this.vel.x, this.vel.y, false, this.color);
    this.particles = [];
  }

  update() {
    if (!this.explode) {
      this.fireworkRocket.update();
      // When velocity turns positive (starts to fall), explode!
      if (this.fireworkRocket.vel.y >= 0) {
        this.exploded();
      }
    } else {
      // Update explosion fragments
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        if (this.particles[i].done) {
          this.particles.splice(i, 1);
        }
      }
      // If all fragments are gone, the firework object is done
      if (this.particles.length === 0) {
        this.done = true;
      }
    }
  }

  display() {
    if (!this.explode) {
      this.fireworkRocket.display();
    } else {
      for (let p of this.particles) {
        p.display();
      }
    }
  }

  exploded() {
    this.explode = true;
    for (let i = 0; i < 80; i++) {
      let pVel = p5.Vector.random2D();
      pVel.mult(random(2, 8)); // Random explosion force
      this.particles.push(new Particles(
        this.fireworkRocket.pos.x, 
        this.fireworkRocket.pos.y, 
        pVel.x, 
        pVel.y, 
        true, 
        this.color
      ));
    }
  }
}