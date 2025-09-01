import { adjustGridSystem, animationButton, running, setFinished } from '../Common/common.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_TOP_MARGIN } from '../Common/constants.js'; 

let theta = 0;
let theta2 = Math.PI/2;
let dtheta = 0.01;
let R = 1;

let P = {x:1, y:0};

let P2 = {x:0, y:1};

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
  let button_x = CANVAS_WIDTH -100;
  let button_y = CANVAS_TOP_MARGIN + 60;
  animationButton(cnv_x, cnv_y, null, {x: button_x, y: button_y});
}

function draw() {
  background('white');
  translate(width/2,height/2);
  scale(1,-1);
  drawAxis();
 
  // Unit Circle + Point + Line
  let px, py = drawUnitCircle();
  
  // Sine Wave
  drawSineCosineWave(px, py);

  // Update for next frame
  if (running) {
    theta += dtheta;
    theta2 += dtheta;
    
    let xNew = P.x * cosd - P.y * sind;
    let yNew = P.x * sind + P.y * cosd; 
    P.x = xNew;
    P.y = yNew;
    
    let xNew2 = P2.x * cosd - P2.y * sind;
    let yNew2 = P2.x * sind + P2.y * cosd; 
    P2.x = xNew2;
    P2.y = yNew2;
  }
  push();
  scale(1, -1);  // undo the flipped canvas for text
  setTitle();
  pop();
}

function drawAxis() {
  const TOP_MARGIN = 70;
  stroke('lightgray');
  strokeWeight(2);
  line(-width/2, 0, width/2, 0);
  line(0,-height/2,0,height/2-TOP_MARGIN); 

// --- Δθ axis ticks and labels (newest at left, Δθ=0) ---
const waveW = THETA_SPAN * X_PER_RAD;
const tickStep = Math.PI / 2;  // tick spacing = π/2 rad
const numTicks = Math.floor(THETA_SPAN / tickStep);

for (let k = 0; k <= numTicks; k++) {
  const dTheta = k * tickStep;
  const xTick = dTheta * X_PER_RAD;
  if (xTick > waveW) continue;

  // draw tick mark
  line(xTick, -6, xTick, 6);

  // label text
  let lbl = '';
  if (k === 0) lbl = 'Δθ=0';
  else if (k === 1) lbl = 'Δθ=π/2';
  else if (k === 2) lbl = 'Δθ=π';
  else if (k === 3) lbl = 'Δθ=3π/2';
  else if (k === 4) lbl = 'Δθ=2π';

  // draw the label (in screen coords, so flip back)
  push();
  scale(1, -1);
  fill('grey');
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text(lbl, xTick, 10);  // a little below the axis
  pop();
}
}

function setTitle() {
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(30);
  text("sin(θ) & cos(θ)\nUnit Circle", 0, -height/2);
}

function drawUnitCircle() {

  // Unit Circle
  push();
  noFill();
  stroke(0);
  circle(0,0,R*2*S);
  pop();

  const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
  const angleLabels = ['2π','π/4', 'π/2', '3π/4', 'π', '5π/4', '3π/2', '7π/4'];
  angles.forEach((angle, index) => {
    const x = R * Math.cos(angle) * S;
    const y = R * Math.sin(angle) * S;
    push();
    stroke(0);
    strokeWeight(1);
    line(x*0.98, y*0.98, x*1.01, y*1.01);
    pop();
    push();
    scale(1, -1); // flip back for text
    fill(0);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(angleLabels[index], x*1.1, -y*1.1);
    pop();
  });


  let px = P.x * S;
  let py = P.y * S;

  let px2 = P2.x * S;
  let py2 = P2.y * S;

  // Sine perpendicular from the Point 
  push()
  noFill();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  // perpendicular line to x-axis
  stroke('purple');
  line(px,py,px,0);
  // perpendicular line to y-axis
  stroke('purple');
  line(px,py,0,py);
  pop();

  // Sine perpendicular from the Point 
  push()
  noFill();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  // perpendicular line to x-axis
  stroke('teal');
  line(px2,py2,px2,0);
  // perpendicular line to y-axis
  stroke('teal');
  line(px2,py2,0,py2);
  pop();

  // Point on Circle for Sine
  push();
  fill('purple');
  circle(px, py, 10);
  stroke('purple');
  line(0,0,px,py);
  pop();

  // Point 2 on Circle
  push();
  fill('teal');
  circle(px2, py2, 10);
  stroke('teal');
  line(0,0,px2,py2);
  pop();
  return {x: px, y: py};
}

function drawSineCosineWave(px, py) {
//   // --- store (theta, y, x) ---
  if (running) {
    history.push({ theta, y: P.y, x: P.x });
    while (history.length && history[history.length - 1].theta - history[0].theta > THETA_SPAN) {
      history.shift();
    }
  }

// θ with NEWEST at the LEFT ---
const waveW = THETA_SPAN * X_PER_RAD;
const thetaLatest = history.length ? history[history.length - 1].theta : theta;

// Code to draw waves

// polyline: for sine Wave
noFill();
stroke('purple'); 
strokeWeight(2);
beginShape();
for (let i = history.length - 1; i >= 0; i--) {
  const s = history[i];
  const xPix = (thetaLatest - s.theta) * X_PER_RAD;  // newest at 0

  if (xPix >= 0 && xPix <= waveW) {
    vertex(xPix, s.y * S);
  }
}
endShape();

// polyline: for cosine wave
noFill();
stroke('teal'); 
strokeWeight(3);
beginShape();
for (let i = history.length - 1; i >= 0; i--) {
  const s = history[i];
  const xPix = (thetaLatest - s.theta) * X_PER_RAD;  // newest at 0
  if (xPix >= 0 && xPix <= waveW) {
    vertex(xPix, s.x * S);
  }
}
endShape();

}

window.setup = setup;
window.draw = draw;