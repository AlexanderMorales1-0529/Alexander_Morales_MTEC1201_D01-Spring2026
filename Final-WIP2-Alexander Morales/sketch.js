// Name: Alexander Morales
// Game: Leyendas de mi Tierra
//
// Leyendas de mi Tierra is a 2D RPG game I am making with JavaScript
// and p5.js. The idea is to show Colombian folklore and different
// types of places in Colombia.
//
// In the full idea of the game, the player is a traveler going through
// 5 main areas:
// - the Andean mountains
// - the Caribbean coast
// - the Pacific mangroves
// - the Amazon jungle
// - the Llanos
//
// The game is mostly about exploring and fighting in real time. When the
// player moves to another region, the map changes and the game gets harder.
// The bosses are going to be famous Colombian myths like El Sombreron,
// La Tunda, and Madremonte.
//
// The goal is to find special artifacts while trying not to get defeated
// by these legends. I want the game to feel like an old retro game but
// with a Colombian twist.
//
// This file is just a demo version of the game. For learning how to build
// this, I watched tutorials from RyiSnow and freeCodeCamp.org.
//
// Note: I put many comments because this is still a learning project and
// I want to remember what each part does later.
// ============================================================

// ---------- Main game state ----------
let gameState = "start"; // this controls if we are on start screen, playing, game over, etc
let currentMap = 0;      // 0 is mapa1, 1 is mapa2, and 2 is mapa3

// ---------- Images ----------
let startScreenImage; // image for the first menu screen
let backgroundImage;  // big background behind the map
let mapImages = [];   // this keeps all the maps in one array

// ---------- Sprite containers ----------
let mateo = {};         // all Mateo animations go here
let snakeSprites = {};  // all snake animations go here
let vultureSprites = {}; // all vulture animations go here
let bossSprites = {};   // all boss animations go here

// ---------- Game objects ----------
let player;        // Mateo object
let enemies = [];  // normal enemies like snake and vulture
let boss = null;   // boss starts as null until map 3

// ---------- Simple tuning values ----------
const GRAVITY = 0.6;                 // pulls Mateo down
const JUMP_FORCE = -12;              // how strong Mateo jumps
const PLAYER_SPEED = 5;              // how fast Mateo walks
const PLAYER_SIZE = 64;              // Mateo drawing size
const ENEMY_SIZE = 64;               // normal enemy drawing size
const BOSS_SIZE = 96;                // boss drawing size, smaller so jumping over him feels better
const FRAME_SIZE = 48;               // enemy sprite sheets use 48x48 frames
const ATTACK_FRAME_HOLD = 4;         // lower number makes Mateo attack animation faster
const ENEMY_DISAPPEAR_DELAY = 120;   // enemies disappear after 120 frames, around 2 seconds
const PLAYER_REGEN_AMOUNT = 10;      // Mateo heals 10 hp
const PLAYER_REGEN_INTERVAL = 300;   // 300 frames is around 5 seconds
const BOSS_DEATH_DURATION = 110;     // how long boss death animation plays

// ============================================================
// PRELOAD
// p5 loads all images here before setup starts.
// ============================================================
function preload() {
  // Load start screen image.
  startScreenImage = loadImage("images/background startscreen.png");

  // Load gameplay background image.
  backgroundImage = loadImage("images/background (2).png");

  // Load the maps. These maps are also used for collision.
  mapImages[0] = loadImage("images/maps/mapa1.png");
  mapImages[1] = loadImage("images/maps/mapa2.png");
  mapImages[2] = loadImage("images/maps/mapa3.png");

  // Load Mateo idle animations.
  mateo.idleRight = loadImage("images/mateo/idle/idle 1.gif");
  mateo.idleLeft = loadImage("images/mateo/idle/idle0.gif");

  // Load Mateo walking animations.
  mateo.walkLeft = loadImage("images/mateo/walking/walk l.gif");
  mateo.walkRight = loadImage("images/mateo/walking/walk r.gif");

  // Load Mateo attack animations.
  mateo.attackLeft = loadImage("images/mateo/attack/attack left.gif");
  mateo.attackRight = loadImage("images/mateo/attack/attack rigth.gif");

  // Load Mateo hurt animations.
  mateo.hurtLeft = loadImage("images/mateo/hurt/hurt l.gif");
  mateo.hurtRight = loadImage("images/mateo/hurt/hurt r.gif");

  // Load Mateo death animations.
  mateo.deadLeft = loadImage("images/mateo/dead/died left.gif");
  mateo.deadRight = loadImage("images/mateo/dead/died rigth.gif");

  // Load snake sprite sheets.
  snakeSprites.walk = loadImage("images/enemies/1 Snake/Snake_walk.png");
  snakeSprites.attack = loadImage("images/enemies/1 Snake/Snake_attack.png");
  snakeSprites.hurt = loadImage("images/enemies/1 Snake/Snake_hurt.png");
  snakeSprites.death = loadImage("images/enemies/1 Snake/Snake_death.png");

  // Load vulture sprite sheets.
  vultureSprites.walk = loadImage("images/enemies/4 Vulture/Vulture_walk.png");
  vultureSprites.attack = loadImage("images/enemies/4 Vulture/Vulture_attack.png");
  vultureSprites.hurt = loadImage("images/enemies/4 Vulture/Vulture_hurt.png");
  vultureSprites.death = loadImage("images/enemies/4 Vulture/Vulture_death.png");

  // Load boss animations.
  bossSprites.idleLeft = loadImage("images/enemies/boss1/idle/idle L.gif");
  bossSprites.idleRight = loadImage("images/enemies/boss1/idle/idle R.gif");
  bossSprites.walkLeft = loadImage("images/enemies/boss1/walk/walk l.gif");
  bossSprites.walkRight = loadImage("images/enemies/boss1/walk/walk r.gif");
  bossSprites.attackLeft = loadImage("images/enemies/boss1/attack/attack L.gif");
  bossSprites.attackRight = loadImage("images/enemies/boss1/attack/attack r.gif");
  bossSprites.deadLeft = loadImage("images/enemies/boss1/dead animation/dead L.gif");
  bossSprites.deadRight = loadImage("images/enemies/boss1/dead animation/dead R.gif");
}

// ============================================================
// SETUP
// This runs once when the game first starts.
// ============================================================
function setup() {
  // Make the canvas the same size as the first map.
  createCanvas(mapImages[0].width, mapImages[0].height);

  // Keeps pixel art sharp instead of blurry.
  noSmooth();

  // Make black parts of each map transparent and save pixel data for collision.
  for (let img of mapImages) {
    makeBlackTransparent(img);
    img.loadPixels();
  }

  // Make white backgrounds transparent on enemy sprite sheets.
  cleanEnemySheet(snakeSprites.walk);
  cleanEnemySheet(snakeSprites.attack);
  cleanEnemySheet(snakeSprites.hurt);
  cleanEnemySheet(snakeSprites.death);
  cleanEnemySheet(vultureSprites.walk);
  cleanEnemySheet(vultureSprites.attack);
  cleanEnemySheet(vultureSprites.hurt);
  cleanEnemySheet(vultureSprites.death);

  // Create Mateo.
  player = new Player(120, 420);

  // Load the first map and put Mateo at x 120.
  loadMap(0, 120);
}

// ============================================================
// DRAW
// This runs every frame.
// ============================================================
function draw() {
  // If we are at the menu, draw only the start screen.
  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  // If we are playing, draw and update the game.
  if (gameState === "play") {
    drawGame();
    return;
  }

  // If Mateo died, draw the game behind the game over screen.
  if (gameState === "gameover") {
    drawGame();
    drawGameOver();
    return;
  }

  // This is here in case I want to use a win screen later.
  if (gameState === "win") {
    drawGame();
    drawWinScreen();
  }
}

// ============================================================
// START SCREEN
// This is the first screen before the game starts.
// ============================================================
function drawStartScreen() {
  // Draw the start screen image.
  image(startScreenImage, 0, 0, width, height);

  // Put dark color over it so text is easy to read.
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);

  // Draw the game title.
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(52);
  text("Leyendas de mi Tierra", width / 2, height / 2 - 100);

  // Draw controls.
  textSize(22);
  text("A / D or Arrow Keys: Move", width / 2, height / 2 - 20);
  text("W / Up Arrow / Space: Jump", width / 2, height / 2 + 18);
  text("F or J: Attack", width / 2, height / 2 + 56);

  // Tell the player how to start.
  textSize(24);
  text("Press ENTER to start", width / 2, height / 2 + 130);

  // Reset text alignment so other text does not get weird later.
  textAlign(LEFT, BASELINE);
}

// ============================================================
// MAIN GAME DRAWING
// This draws the map, enemies, boss, player, and health bars.
// ============================================================
function drawGame() {
  // Draw the big background first.
  image(backgroundImage, 0, 0, width, height);

  // Draw the current map on top of the background.
  image(getMap(), 0, 0);

  // Only update movement/combat when actually playing.
  if (gameState === "play") {
    // Update normal enemies.
    for (let enemy of enemies) enemy.update();

    // Remove enemies after they have been dead for 2 seconds.
    enemies = enemies.filter(enemy => !enemy.readyToRemove());

    // Update boss if there is one.
    if (boss) boss.update();

    // Update Mateo.
    player.update();
  }

  // Draw normal enemies.
  for (let enemy of enemies) enemy.draw();

  // Draw boss if it exists.
  if (boss) boss.draw();

  // Draw Mateo.
  player.draw();

  // Draw Mateo health.
  drawHealthBar(20, 20, 220, 18, player.health, player.maxHealth, "Mateo");

  // Draw health bars above normal enemies.
  for (let enemy of enemies) {
    if (!enemy.dead) {
      drawHealthBar(enemy.x - 8, enemy.y - 14, 78, 7, enemy.health, enemy.maxHealth, "");
    }
  }

  // Draw boss health bar only while he is alive.
  if (boss && !boss.dead) {
    drawHealthBar(width / 2 - 180, 54, 360, 20, boss.health, boss.maxHealth, "Boss");
  }
}

// ============================================================
// MAP LOADING
// This changes maps and creates enemies for each section.
// ============================================================
function loadMap(mapIndex, playerX) {
  // Save which map we are using.
  currentMap = mapIndex;

  // Resize the canvas to match the new map.
  resizeCanvas(getMap().width, getMap().height);

  // Clear old enemies and boss.
  enemies = [];
  boss = null;

  // Put Mateo in the new map.
  player.x = playerX;
  player.y = findGroundY(playerX + player.w / 2, player.h);
  player.vx = 0;
  player.vy = 0;

  // Map 1 has one snake.
  if (currentMap === 0) {
    enemies.push(new GroundEnemy(330, findGroundY(330, ENEMY_SIZE), snakeSprites, 75, 10));
  }

  // Map 2 has one snake and one vulture.
  if (currentMap === 1) {
    enemies.push(new GroundEnemy(245, findGroundY(245, ENEMY_SIZE), snakeSprites, 75, 10));
    enemies.push(new Vulture(690, 265));
  }

  // Map 3 has the boss.
  if (currentMap === 2) {
    boss = new Boss(660, findGroundY(660, BOSS_SIZE));
  }
}

// ============================================================
// PLAYER CLASS
// This is Mateo. It controls movement, jumping, attacking,
// taking damage, healing slowly, and drawing animations.
// ============================================================
class Player {
  constructor(x, y) {
    // Position and size.
    this.x = x;
    this.y = y;
    this.w = PLAYER_SIZE;
    this.h = PLAYER_SIZE;

    // Speed and gravity movement.
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;

    // Mateo starts looking right.
    this.facingRight = true;

    // Health.
    this.maxHealth = 100;
    this.health = 100;
    this.dead = false;

    // Attack timers.
    this.attackTimer = 0;
    this.attackDuration = 0;
    this.attackCooldown = 0;
    this.hasHitThisAttack = false;

    // Hurt/death timers.
    this.hurtTimer = 0;
    this.damageCooldown = 0;
    this.deathTimer = 0;

    // Health regeneration timer.
    this.regenTimer = 0;
  }

  update() {
    // If Mateo is dead, only count death animation time.
    if (this.dead) {
      this.deathTimer++;
      return;
    }

    // Count down timers.
    if (this.attackTimer > 0) this.attackTimer--;
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;
    if (this.damageCooldown > 0) this.damageCooldown--;

    // Heal slowly if Mateo has not been hit recently.
    this.regenerateHealth();

    // Reset horizontal speed each frame.
    this.vx = 0;

    // Attack with F or J.
    if ((keyIsDown(70) || keyIsDown(74)) && this.attackCooldown <= 0 && this.hurtTimer <= 0) {
      this.startAttack();
    }

    // Mateo can only move if he is not attacking or hurt.
    if (this.attackTimer <= 0 && this.hurtTimer <= 0) {
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        this.vx = -PLAYER_SPEED;
        this.facingRight = false;
      }

      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        this.vx = PLAYER_SPEED;
        this.facingRight = true;
      }
    }

    // Jump with up, W, or space.
    if ((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && this.onGround && this.hurtTimer <= 0) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
    }

    // Gravity pulls Mateo down.
    this.vy += GRAVITY;

    // Move and check collision separately.
    this.moveX();
    this.moveY();

    // Keep Mateo inside the screen.
    this.x = constrain(this.x, 0, width - this.w);

    // If Mateo reaches the right side, go to the next map.
    if (this.x >= width - this.w - 4 && currentMap < 2) {
      loadMap(currentMap + 1, 24);
      return;
    }

    // Check if attacks hit enemies.
    this.checkAttackHits();

    // Check if enemies hurt Mateo.
    this.checkEnemyTouches();
  }

  startAttack() {
    // Pick attack image based on direction.
    let img = this.facingRight ? mateo.attackRight : mateo.attackLeft;

    // Use the GIF frame count so it plays all frames.
    let frames = img && typeof img.numFrames === "function" ? img.numFrames() : 6;

    // Duration depends on frames and speed.
    this.attackDuration = frames * ATTACK_FRAME_HOLD;
    this.attackTimer = this.attackDuration;
    this.attackCooldown = this.attackDuration + 10;

    // This makes sure one attack only damages one time.
    this.hasHitThisAttack = false;

    // Restart attack GIFs.
    resetGif(mateo.attackRight);
    resetGif(mateo.attackLeft);
  }

  moveX() {
    // Move left or right.
    this.x += this.vx;

    // If Mateo hits a wall from the right side, push him back.
    if (this.vx > 0 && this.hitRight()) this.resolveX(-1);

    // If Mateo hits a wall from the left side, push him back.
    if (this.vx < 0 && this.hitLeft()) this.resolveX(1);
  }

  moveY() {
    // Move up or down.
    this.onGround = false;
    this.y += this.vy;

    // If falling and feet touch ground, land.
    if (this.vy > 0 && this.hitFeet()) {
      this.resolveY(-1);
      this.vy = 0;
      this.onGround = true;
    }

    // If jumping and head touches ceiling, stop going up.
    if (this.vy < 0 && this.hitHead()) {
      this.resolveY(1);
      this.vy = 0;
    }
  }

  resolveX(direction) {
    // Move one pixel at a time until Mateo is not inside solid pixels.
    let steps = 0;

    while ((this.hitLeft() || this.hitRight()) && steps < 20) {
      this.x += direction;
      steps++;
    }
  }

  resolveY(direction) {
    // Move one pixel at a time until Mateo is not inside solid pixels.
    let steps = 0;

    while ((this.hitFeet() || this.hitHead()) && steps < 35) {
      this.y += direction;
      steps++;
    }
  }

  hitFeet() {
    // These are small points at Mateo's feet for ground collision.
    let y = this.y + this.h - 3;

    return isSolidAt(this.x + 20, y) ||
      isSolidAt(this.x + this.w / 2, y) ||
      isSolidAt(this.x + this.w - 20, y);
  }

  hitHead() {
    // These are small points at Mateo's head for ceiling collision.
    let y = this.y + 12;

    return isSolidAt(this.x + 22, y) ||
      isSolidAt(this.x + this.w - 22, y);
  }

  hitLeft() {
    // Points on the left side of Mateo.
    let x = this.x + 18;

    return isSolidAt(x, this.y + 30) ||
      isSolidAt(x, this.y + this.h - 16);
  }

  hitRight() {
    // Points on the right side of Mateo.
    let x = this.x + this.w - 18;

    return isSolidAt(x, this.y + 30) ||
      isSolidAt(x, this.y + this.h - 16);
  }

  checkAttackHits() {
    // Stop if Mateo is not attacking or already hit something.
    if (this.attackTimer <= 0 || this.hasHitThisAttack) return;

    // Check normal enemies first.
    for (let enemy of enemies) {
      if (!enemy.dead && rectsOverlap(this.attackBox(), enemy.hitbox())) {
        enemy.takeDamage(25);
        this.hasHitThisAttack = true;
        return;
      }
    }

    // Check the boss if there is one.
    if (boss && !boss.dead && rectsOverlap(this.attackBox(), boss.hitbox())) {
      boss.takeDamage(18);
      this.hasHitThisAttack = true;
    }
  }

  checkEnemyTouches() {
    // If Mateo was just hit, he cannot take damage again right away.
    if (this.damageCooldown > 0) return;

    // Normal enemies hurt by touching Mateo.
    for (let enemy of enemies) {
      if (!enemy.dead && rectsOverlap(this.hitbox(), enemy.hitbox())) {
        this.takeDamage(enemy.damage, enemy.x < this.x ? 1 : -1);
        return;
      }
    }

    // Boss only hurts Mateo during the attack window.
    // This fixes the glitch when trying to jump over him.
    if (
      boss &&
      !boss.dead &&
      boss.attackTimer > 10 &&
      boss.attackTimer < 24 &&
      rectsOverlap(this.hitbox(), boss.attackBox())
    ) {
      this.takeDamage(boss.damage, boss.x < this.x ? 1 : -1);
    }
  }

  takeDamage(amount, direction) {
    // Ignore damage if Mateo is dead or in cooldown.
    if (this.dead || this.damageCooldown > 0) return;

    // Lower Mateo health.
    this.health = max(0, this.health - amount);

    // Start hurt state and cooldown.
    this.hurtTimer = 26;
    this.damageCooldown = 60;
    this.attackTimer = 0;

    // Reset healing timer after getting hit.
    this.regenTimer = 0;

    // Knock Mateo back.
    this.vy = -7;
    this.x += direction * 26;

    // Restart hurt GIF.
    resetGif(mateo.hurtRight);
    resetGif(mateo.hurtLeft);

    // If health reaches 0, game over.
    if (this.health <= 0) {
      this.dead = true;
      this.deathTimer = 0;
      gameState = "gameover";
      resetGif(mateo.deadRight);
      resetGif(mateo.deadLeft);
    }
  }

  attackBox() {
    // This rectangle is the sword/attack area.
    if (this.facingRight) {
      return { x: this.x + 40, y: this.y + 20, w: 58, h: 36 };
    }

    return { x: this.x - 34, y: this.y + 20, w: 58, h: 36 };
  }

  hitbox() {
    // Mateo's hitbox is smaller than the sprite.
    return { x: this.x + 18, y: this.y + 10, w: this.w - 36, h: this.h - 12 };
  }

  draw() {
    // Pick which animation to draw.
    let img;

    if (this.dead) {
      img = this.facingRight ? mateo.deadRight : mateo.deadLeft;
      img = playGifOnce(img, this.deathTimer, 90);
    } else if (this.hurtTimer > 0) {
      img = this.facingRight ? mateo.hurtRight : mateo.hurtLeft;
      img = playGifOnce(img, 26 - this.hurtTimer, 26);
    } else if (this.attackTimer > 0) {
      img = this.facingRight ? mateo.attackRight : mateo.attackLeft;
      img = playAttackGif(img, this.attackTimer, this.attackDuration);
    } else if (abs(this.vx) > 0) {
      img = this.facingRight ? mateo.walkRight : mateo.walkLeft;
    } else {
      img = this.facingRight ? mateo.idleRight : mateo.idleLeft;
    }

    // Draw Mateo on the screen.
    image(img, this.x, this.y, this.w, this.h);
  }

  regenerateHealth() {
    // If Mateo is full health, don't heal.
    if (this.health >= this.maxHealth) {
      this.regenTimer = 0;
      return;
    }

    // If Mateo is hurt or just got hit, don't heal yet.
    if (this.hurtTimer > 0 || this.damageCooldown > 0) {
      this.regenTimer = 0;
      return;
    }

    // Count time until healing.
    this.regenTimer++;

    // Heal 10 hp every 5 seconds.
    if (this.regenTimer >= PLAYER_REGEN_INTERVAL) {
      this.health = min(this.maxHealth, this.health + PLAYER_REGEN_AMOUNT);
      this.regenTimer = 0;
    }
  }
}

// ============================================================
// GROUND ENEMY CLASS
// This is used for the snake.
// ============================================================
class GroundEnemy {
  constructor(x, y, sprites, health, damage) {
    // Position and size.
    this.x = x;
    this.y = y;
    this.w = ENEMY_SIZE;
    this.h = ENEMY_SIZE;

    // Patrol limits.
    this.leftLimit = x - 85;
    this.rightLimit = x + 135;

    // Movement.
    this.speed = 1.1;
    this.facingRight = false;

    // Sprites and combat.
    this.sprites = sprites;
    this.maxHealth = health;
    this.health = health;
    this.damage = damage;
    this.dead = false;

    // Timers.
    this.hurtTimer = 0;
    this.attackTimer = 0;
    this.deathTimer = 0;
  }

  update() {
    // If dead, just count death time.
    if (this.dead) {
      this.deathTimer++;
      return;
    }

    // If hurt, pause for a moment.
    if (this.hurtTimer > 0) {
      this.hurtTimer--;
      return;
    }

    // If Mateo is close, use attack animation.
    let distanceToPlayer = abs(player.x - this.x);

    if (distanceToPlayer < 78 && abs(player.y - this.y) < 60) {
      this.attackTimer = 24;
      this.facingRight = player.x > this.x;
      return;
    }

    // Let attack animation finish.
    if (this.attackTimer > 0) {
      this.attackTimer--;
      return;
    }

    // Patrol left and right.
    this.x += this.facingRight ? this.speed : -this.speed;

    // Turn around at patrol limits.
    if (this.x <= this.leftLimit) this.facingRight = true;
    if (this.x >= this.rightLimit) this.facingRight = false;
  }

  takeDamage(amount) {
    // Don't damage dead enemies.
    if (this.dead) return;

    // Lower health.
    this.health = max(0, this.health - amount);

    // Show hurt animation.
    this.hurtTimer = 18;

    // Die if health reaches 0.
    if (this.health <= 0) {
      this.dead = true;
      this.deathTimer = 0;
    }
  }

  hitbox() {
    // Smaller hitbox for the snake body.
    return { x: this.x + 12, y: this.y + 28, w: this.w - 20, h: this.h - 30 };
  }

  draw() {
    // Pick sprite sheet.
    let sheet = this.sprites.walk;
    let frames = 4;

    // Death animation.
    if (this.dead) {
      sheet = this.sprites.death;
      frames = 4;
    }

    // Hurt animation.
    else if (this.hurtTimer > 0) {
      sheet = this.sprites.hurt;
      frames = 2;
    }

    // Attack animation.
    else if (this.attackTimer > 0) {
      sheet = this.sprites.attack;
      frames = 6;
    }

    // Draw the current frame.
    drawSheetFrame(sheet, this.x, this.y, this.w, this.h, frames, this.facingRight, this.dead ? this.deathTimer : frameCount);
  }

  readyToRemove() {
    // Remove enemy after being dead for 2 seconds.
    return this.dead && this.deathTimer > ENEMY_DISAPPEAR_DELAY;
  }
}

// ============================================================
// VULTURE CLASS
// This is the flying enemy in map 2.
// ============================================================
class Vulture {
  constructor(x, y) {
    // Position and size.
    this.x = x;
    this.y = y;
    this.w = ENEMY_SIZE;
    this.h = ENEMY_SIZE;

    // This is where the vulture floats around.
    this.homeY = y;

    // Movement.
    this.speed = 1.7;
    this.facingRight = false;

    // Health and damage.
    this.maxHealth = 90;
    this.health = 90;
    this.damage = 15;
    this.dead = false;

    // Timers.
    this.hurtTimer = 0;
    this.attackTimer = 0;
    this.deathTimer = 0;
  }

  update() {
    // If dead, fall down slowly.
    if (this.dead) {
      this.deathTimer++;
      this.y += 1.2;
      return;
    }

    // If hurt, pause a little.
    if (this.hurtTimer > 0) {
      this.hurtTimer--;
      return;
    }

    // Find distance from Mateo.
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distanceToPlayer = dist(this.x, this.y, player.x, player.y);

    // Chase Mateo if he is close.
    if (distanceToPlayer < 250 && !player.dead) {
      this.facingRight = dx > 0;
      this.x += constrain(dx, -this.speed, this.speed);
      this.y += constrain(dy - 35, -this.speed, this.speed);

      // Use attack animation when close enough.
      if (distanceToPlayer < 82) this.attackTimer = 20;
    } else {
      // Floating movement when not chasing.
      this.x += sin(frameCount * 0.035) * 1.2;
      this.y += (this.homeY + sin(frameCount * 0.05) * 18 - this.y) * 0.03;
    }

    // Count attack timer down.
    if (this.attackTimer > 0) this.attackTimer--;
  }

  takeDamage(amount) {
    // Don't damage dead vulture.
    if (this.dead) return;

    // Lower health.
    this.health = max(0, this.health - amount);

    // Hurt timer.
    this.hurtTimer = 18;

    // Die if health is gone.
    if (this.health <= 0) {
      this.dead = true;
      this.deathTimer = 0;
    }
  }

  hitbox() {
    // Smaller flying hitbox.
    return { x: this.x + 10, y: this.y + 12, w: this.w - 20, h: this.h - 20 };
  }

  draw() {
    // Pick sprite sheet.
    let sheet = vultureSprites.walk;
    let frames = 4;

    // Death animation.
    if (this.dead) {
      sheet = vultureSprites.death;
      frames = 4;
    }

    // Hurt animation.
    else if (this.hurtTimer > 0) {
      sheet = vultureSprites.hurt;
      frames = 2;
    }

    // Attack animation.
    else if (this.attackTimer > 0) {
      sheet = vultureSprites.attack;
      frames = 4;
    }

    // Draw vulture.
    drawSheetFrame(sheet, this.x, this.y, this.w, this.h, frames, this.facingRight, this.dead ? this.deathTimer : frameCount);
  }

  readyToRemove() {
    // Remove vulture after 2 seconds dead.
    return this.dead && this.deathTimer > ENEMY_DISAPPEAR_DELAY;
  }
}

// ============================================================
// BOSS CLASS
// This is the final boss in map 3.
// ============================================================
class Boss {
  constructor(x, y) {
    // Position and size.
    this.x = x;
    this.y = y;
    this.w = BOSS_SIZE;
    this.h = BOSS_SIZE;

    // Boss movement is slower now so it is not too hard.
    this.speed = 1.3;
    this.facingRight = false;

    // Boss stats. Lower than before to make the demo fair.
    this.maxHealth = 180;
    this.health = 180;
    this.damage = 14;
    this.dead = false;

    // Timers.
    this.attackTimer = 0;
    this.attackCooldown = 0;
    this.hurtTimer = 0;
    this.deathTimer = 0;
  }

  update() {
    // If boss is dead, play death animation first.
    if (this.dead) {
      this.deathTimer++;

      // After death animation, remove boss and go back to menu.
      if (this.deathTimer > BOSS_DEATH_DURATION) {
        boss = null;
        resetToMainMenu();
      }

      return;
    }

    // Count timers.
    if (this.attackTimer > 0) this.attackTimer--;
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;

    // Boss looks at Mateo.
    this.facingRight = player.x > this.x;

    // Move toward Mateo.
    let dx = player.x - this.x;

    // Boss moves only if he is not too close and not attacking.
    if (abs(dx) > 95 && this.attackTimer <= 0) {
      this.x += dx > 0 ? this.speed : -this.speed;
    }

    // Start attack if Mateo is close.
    if (abs(dx) < 105 && abs(player.y - this.y) < 70 && this.attackCooldown <= 0) {
      this.attackTimer = 34;
      this.attackCooldown = 110;
    }

    // Damage happens in the middle of the boss attack.
    if (this.attackTimer === 17 && rectsOverlap(this.attackBox(), player.hitbox())) {
      player.takeDamage(this.damage, this.x < player.x ? 1 : -1);
    }
  }

  takeDamage(amount) {
    // Don't damage dead boss.
    if (this.dead) return;

    // Lower boss health.
    this.health = max(0, this.health - amount);

    // Flash red for a bit.
    this.hurtTimer = 12;

    // Start death animation if boss health is 0.
    if (this.health <= 0) {
      this.dead = true;
      this.deathTimer = 0;
      this.attackTimer = 0;
      this.attackCooldown = 0;
      resetGif(bossSprites.deadRight);
      resetGif(bossSprites.deadLeft);
    }
  }

  attackBox() {
    // Smaller attack box so boss is fairer.
    if (this.facingRight) {
      return { x: this.x + 62, y: this.y + 42, w: 58, h: 34 };
    }

    return { x: this.x - 20, y: this.y + 42, w: 58, h: 34 };
  }

  hitbox() {
    // Smaller boss body hitbox so jumping over him does not glitch as much.
    return { x: this.x + 34, y: this.y + 30, w: this.w - 68, h: this.h - 34 };
  }

  draw() {
    // Pick boss animation.
    let img;

    // Death animation.
    if (this.dead) {
      img = this.facingRight ? bossSprites.deadRight : bossSprites.deadLeft;
      img = playGifOnce(img, this.deathTimer, BOSS_DEATH_DURATION);
    }

    // Attack animation.
    else if (this.attackTimer > 0) {
      img = this.facingRight ? bossSprites.attackRight : bossSprites.attackLeft;
    }

    // Walking animation.
    else if (abs(player.x - this.x) > 95) {
      img = this.facingRight ? bossSprites.walkRight : bossSprites.walkLeft;
    }

    // Idle animation.
    else {
      img = this.facingRight ? bossSprites.idleRight : bossSprites.idleLeft;
    }

    // Red flash when hurt.
    if (this.hurtTimer > 0 && frameCount % 8 < 4) tint(255, 100, 100);

    // Draw boss.
    image(img, this.x, this.y, this.w, this.h);

    // Reset tint so other sprites do not become red.
    noTint();
  }
}

// ============================================================
// INPUT
// Handles start and restart keys.
// ============================================================
function keyPressed() {
  // Start game from menu.
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "play";
  }

  // Restart after game over or win.
  if ((gameState === "gameover" || gameState === "win") && (key === "r" || key === "R")) {
    resetToMainMenu();
  }
}

function resetToMainMenu() {
  // Restore Mateo health and state.
  player.health = player.maxHealth;
  player.dead = false;
  player.deathTimer = 0;
  player.hurtTimer = 0;
  player.damageCooldown = 0;
  player.attackTimer = 0;
  player.attackCooldown = 0;
  player.regenTimer = 0;

  // Reload first map.
  loadMap(0, 120);

  // Go back to the start screen.
  gameState = "start";
}

// ============================================================
// UI SCREENS
// Game over and win screen.
// ============================================================
function drawGameOver() {
  // Dark background over the game.
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);

  // Game over text.
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(46);
  text("GAME OVER", width / 2, height / 2 - 20);

  // Restart text.
  textSize(18);
  text("Press R to restart", width / 2, height / 2 + 28);

  // Reset text alignment.
  textAlign(LEFT, BASELINE);
}

function drawWinScreen() {
  // Dark background over the game.
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);

  // Win text.
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(42);
  text("You defeated the legend!", width / 2, height / 2 - 20);

  // Restart text.
  textSize(18);
  text("Press R to play again", width / 2, height / 2 + 28);

  // Reset text alignment.
  textAlign(LEFT, BASELINE);
}

function drawHealthBar(x, y, w, h, value, maxValue, label) {
  // Calculate percentage of health left.
  let pct = constrain(value / maxValue, 0, 1);

  // No outline stroke.
  noStroke();

  // Dark border behind the bar.
  fill(20, 20, 20, 180);
  rect(x - 2, y - 2, w + 4, h + 4, 4);

  // Red empty health bar.
  fill(90, 20, 20);
  rect(x, y, w, h, 3);

  // Green current health.
  fill(40, 200, 70);
  rect(x, y, w * pct, h, 3);

  // Draw label if there is one.
  if (label) {
    fill(255);
    textSize(14);
    text(label + " " + value + "/" + maxValue, x, y + h + 16);
  }
}

// ============================================================
// ANIMATION HELPERS
// These help draw sprite sheets and GIFs.
// ============================================================
function drawSheetFrame(sheet, x, y, w, h, totalFrames, facingRight, timer) {
  // Pick current frame number.
  let frame = floor(timer / 8) % totalFrames;

  // Draw flipped if facing right.
  push();

  if (facingRight) {
    translate(x + w, y);
    scale(-1, 1);
    image(sheet, 0, 0, w, h, frame * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE);
  } else {
    image(sheet, x, y, w, h, frame * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE);
  }

  pop();
}

function resetGif(img) {
  // Some p5 GIFs can restart with setFrame.
  if (img && typeof img.setFrame === "function") img.setFrame(0);
}

function playAttackGif(img, timer, duration) {
  // If p5 cannot control this GIF, just return the image.
  if (!img || typeof img.numFrames !== "function" || typeof img.setFrame !== "function") return img;

  // Calculate the frame based on attack timer.
  let frames = img.numFrames();
  let elapsed = duration - timer;
  let frame = constrain(floor(elapsed / ATTACK_FRAME_HOLD), 0, frames - 1);

  // Set GIF frame.
  img.setFrame(frame);

  return img;
}

function playGifOnce(img, elapsed, duration) {
  // If p5 cannot control this GIF, just return it.
  if (!img || typeof img.numFrames !== "function" || typeof img.setFrame !== "function") return img;

  // Play from first frame to last frame one time.
  let frames = img.numFrames();
  let frame = constrain(floor((elapsed / duration) * frames), 0, frames - 1);

  // Set GIF frame.
  img.setFrame(frame);

  return img;
}

// ============================================================
// COLLISION HELPERS
// The maps are used like collision masks.
// Black is empty, colored pixels are solid.
// ============================================================
function getMap() {
  // Return current map image.
  return mapImages[currentMap];
}

function isSolidAt(x, y) {
  // Get current map.
  let img = getMap();

  // Convert to pixel numbers.
  x = floor(x);
  y = floor(y);

  // Outside sides/bottom of map are solid.
  if (x < 0 || x >= img.width || y >= img.height) return true;

  // Above map is empty.
  if (y < 0) return false;

  // Get pixel color from image.
  let index = 4 * (y * img.width + x);
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  let a = img.pixels[index + 3];

  // Visible colored pixels count as solid.
  return a > 10 && r + g + b > 40;
}

function findGroundY(x, objectHeight) {
  // Scan down from the top until we find ground.
  for (let y = 0; y < getMap().height; y++) {
    if (isSolidAt(x, y)) return y - objectHeight;
  }

  // If no ground found, put object near bottom.
  return getMap().height - objectHeight;
}

function rectsOverlap(a, b) {
  // Basic rectangle collision.
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

// ============================================================
// IMAGE CLEANUP HELPERS
// These make black map backgrounds and white sprite backgrounds invisible.
// ============================================================
function makeBlackTransparent(img) {
  // Load image pixels so we can edit them.
  img.loadPixels();

  // Go through every pixel.
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];

    // If pixel is almost black, make it transparent.
    if (r + g + b < 40) {
      img.pixels[i + 3] = 0;
    }
  }

  // Save edited pixels.
  img.updatePixels();
}

function cleanEnemySheet(img) {
  // Load sprite sheet pixels.
  img.loadPixels();

  // Go through every pixel.
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];

    // If pixel is almost white, make it transparent.
    if (r > 235 && g > 235 && b > 235) {
      img.pixels[i + 3] = 0;
    }
  }

  // Save edited pixels.
  img.updatePixels();
}