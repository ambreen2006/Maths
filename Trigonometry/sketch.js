theta = 0;
let dtheta = 0.03;
let R = 1;
let P = {x:1, y:0};
let S = 200;
let W = 1400;
let H = 800;

const X_PER_RAD = 120; 
let history = [];        // store {theta, y}
const THETA_SPAN = 2 * Math.PI; // show one full cycle


const cosd = Math.cos(dtheta);
const sind = Math.sin(dtheta);

let frameCountSinceNormalize = 0;
const NORM_EVERY = 60;

function setup() {
  let cnv = createCanvas(W, H);
  let cnv_x = (windowWidth - width) / 4;
  let cnv_y = (windowHeight - height) / 2;
  cnv.position(cnv_x, cnv_y);
  background(220);
}

function draw() {
  background(220);

  // Unit Circle
  translate(width/2,height/2);
  scale(1,-1);
  drawAxis();
  noFill();
  stroke('gray');
  circle(0,0,R*2*S);

  px = P.x * S;
  py = P.y * S;
  fill('red');
  circle(px, py, 10);
  stroke('red');
  line(0,0,px,py);


  // Sine Wave

  // --- store (theta, y) ---
  history.push({ theta, y: P.y });
  while (history.length && history[history.length - 1].theta - history[0].theta > THETA_SPAN) {
    history.shift();
  }

  // --- draw sine wave y vs θ ---
  const theta0 = history[0]?.theta ?? theta - THETA_SPAN;
  stroke(0); line(0, 0, THETA_SPAN * X_PER_RAD, 0); // baseline
  noFill(); stroke(0, 100, 255); beginShape();
  for (const s of history) {
    const xPix = (s.theta - theta0) * X_PER_RAD;
    const yPix = s.y * S;
    vertex(xPix, yPix);
  }
  endShape();

  // live dot
  if (history.length) {
    const s = history[history.length - 1];
    const xPix = (s.theta - theta0) * X_PER_RAD;
    const yPix = s.y * S;
    stroke(255, 0, 0); strokeWeight(6); point(xPix, yPix);
  }

  // Update for next frame

  theta += dtheta;
  xNew = P.x * cosd - P.y * sind;
  yNew = P.x * sind + P.y * cosd; 
  P.x = xNew;
  P.y = yNew;
}

function drawAxis(){
  stroke(0);
  strokeWeight(2);
  line(-width/2, 0, width/2, 0);
  line(0,-height,0,height); 
}
