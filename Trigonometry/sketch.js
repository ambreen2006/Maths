theta = 0;
let dtheta = 0.01;
let R = 1;
let P = {x:1, y:0};
let S = 200;
let W = 1400;
let H = 800;
let button = null;
let running = true;


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

  animationButton(cnv_x, cnv_y);
}

function draw() {
  background(220);
  translate(width/2,height/2);
  setTitle();
  scale(1,-1);
  drawAxis();
 
  // Unit Circle + Point + Line
  let px, py = drawUnitCircle();
  
  // Sine Wave
  drawSineWave(px, py);

  // Update for next frame
  if (running) {
    theta += dtheta;
    xNew = P.x * cosd - P.y * sind;
    yNew = P.x * sind + P.y * cosd; 
    P.x = xNew;
    P.y = yNew;
    }
}

function drawAxis(){
  stroke(0);
  strokeWeight(2);
  line(-width/2, 0, width/2, 0);
  line(0,-height,0,height); 
}

function animationButton(cnvX, cnvY) {
  button = createButton('⏸ Pause');

  button.style('padding', '10px 20px');
  button.style('font-size', '16px');
  button.style('border', 'none');
  button.style('border-radius', '8px');
  button.style('background-color', '#c104faff'); // green
  button.style('color', 'white');
  button.style('cursor', 'pointer');
  button.style('box-shadow', '2px 2px 6px rgba(0,0,0,0.3)');

   // hover effect
  button.mouseOver(() => button.style('background-color', '#b4049dff'));
  button.mouseOut(() => button.style('background-color', '#c104faff'));


  button.position(cnvX+12, cnvY+12);
  button.mousePressed(() => {
    running = !running;
    button.html(running ? '⏸ Pause' : '▶ Start');
  });
}

function setTitle() {
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(30);
  text("Unit Circle • y = sin(θ)", 0, -height/2 + 14);
}

function drawUnitCircle() {

  // Unit Circle
  noFill();
  stroke('gray');
  circle(0,0,R*2*S);

  // Point on Circle
  px = P.x * S;
  py = P.y * S;
  fill('red');
  circle(px, py, 10);
  stroke('red');
  line(0,0,px,py);

  // Line from the Point 
  push()
  noFill();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  stroke('red');
  line(px,py,px,0);
  line(px,py,0,py);
  pop();
  return {x: px, y: py};
}

function drawSineWave(px, py) {
 // Sine Wave

  // --- store (theta, y) ---
  if (running) {
    history.push({ theta, y: P.y });
    while (history.length && history[history.length - 1].theta - history[0].theta > THETA_SPAN) {
      history.shift();
    }
  }

  // --- draw sine wave y vs θ with NEWEST at the LEFT ---
const waveW = THETA_SPAN * X_PER_RAD;
const thetaLatest = history.length ? history[history.length - 1].theta : theta;

// θ ticks to the right: 0, π/2, π, 3π/2, 2π away from newest
stroke(100);
for (const t of [0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI]) {
  const xTick = t * X_PER_RAD;              // distance from newest
  if (xTick <= waveW) line(xTick, -6, xTick, 6);
}

// polyline: map each stored sample by distance from newest
noFill();
stroke(0, 100, 255); strokeWeight(2);
beginShape();
//for (const s of history) {
for (let i = history.length - 1; i >= 0; i--) {
  const s = history[i];
  const xPix = (thetaLatest - s.theta) * X_PER_RAD;  // newest at 0
  if (xPix >= 0 && xPix <= waveW) {
    vertex(xPix, s.y * S);
  }
}
endShape();

// live dot
  if (history.length) {
    const s = history[history.length - 1];
    const xPix = (s.theta - thetaLatest) * X_PER_RAD;
    const yPix = s.y * S;
    stroke(255, 0, 0); strokeWeight(6); point(xPix, yPix);
  }

}