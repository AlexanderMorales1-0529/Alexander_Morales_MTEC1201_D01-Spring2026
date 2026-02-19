//Alexander Morales 
//Title: First Light of the Moon
   /*Concept/Theme: I am investigating how basic geometric primitives in code can create complex emotional atmospheres. 
   This piece explores using triangles and arcs to construct a sailboat and moon, testing how color gradients in the "dark blue" spectrum affect the viewer's sense of depth.
  .*/ 
function setup() {
  createCanvas(1200,600);
}

function draw() {
  background(10,20,104);//color of the background (sky)
  fill(255);
  stroke(0);
  circle(950,100,120); //moon
///creating the craters on the moon
  stroke(0,0,0,50);
  circle(920,100,20);
  circle(970,110,20);
  circle(960,60,20);
  circle(910,80,10);
    circle(920,130,10);
     circle(960,140,15);
     circle(980,80,15);

  


  fill(255);
  noStroke();
circle(200,100,1);//star
circle(300,150,1);//star
circle(400,50,1);//star
circle(500,120,1);//star
circle(600,80,1);//star
circle(700,200,1);//star
circle(800,60,1);//star
circle(900,150,1);//star
circle(1000,50,1);//star
circle(1100,120,1);//star
circle(1200,80,1);//star
circle(100,200,1);//star 
circle(150,50,1);//star
circle(250,150,1);//star
circle(350,80,1);//star
circle(450,200,1);//star
circle(550,60,1);//star
circle(650,150,1);//star
circle(750,50,1);//star
circle(850,120,1);//star
circle(950,80,1);//star
circle(1050,200,1);//star
circle(1150,60,1);//star


fill(0,20,205);  
rect(0,350,1200,250);//water


////triangle(x1, y1, x2, y2, x3, y3)
fill(0.0,0,100)
ellipse(425,420,200,20);//shadow of the boat

fill(0);
triangle(410,420,410,375,250,375);//boat
triangle(450,420,450,375,590,375);//boat
rect(410,370,40,50);//boat
rect(425,220,10,200);//boat
triangle(410,210,410,360,250,360);//boat



fill(176,142,98);
rect(0,500,1200,100);//land

fill(255,255,255,100);
noStroke();
circle(950,425,120);///reflection of the moon
fill(255,255,255,100);
  noStroke();
circle(100,400,1);//star
circle(300,450,1);//star
circle(500,420,1);//star
circle(600,400,1);//star
circle(700,400,1);//star
circle(800,400,1);//star
circle(900,450,1);//star
circle(1000,480,1);//star
circle(1100,420,1);//star
circle(1200,400,1);//star
circle(100,400,1);//star 
circle(150,400,1);//star
circle(250,450,1);//star
circle(350,80,1);//star
circle(450,200,1);//star
circle(550,60,1);//star
circle(650,150,1);//star
circle(750,50,1);//star
circle(850,120,1);//star
circle(950,80,1);//star
circle(1050,200,1);//star
circle(1150,60,1);//star


}
