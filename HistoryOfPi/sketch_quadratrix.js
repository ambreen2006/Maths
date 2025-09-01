import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_TOP_MARGIN } from '../Common/constants.js'; 
import { adjustGridSystem, animationButton, running, button, setFinished } from '../Common/common.js';

const R = 300;
const nLines = 10;
const steps = R/nLines;
const revealEveryNFrames = 60;     

const deltaTheta = Math.PI/20;

let theta = Math.PI;
let visibleLines = 0;
let intersectingPoints = [];

let lineHeight;

function setup() {
  let cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  let cnv_x = (windowWidth - width) / 4;
  let cnv_y = (windowHeight - height) / 2;
  lineHeight = height/2 - CANVAS_TOP_MARGIN;
  cnv.position(cnv_x, cnv_y);
  animationButton(cnv_x, cnv_y, reset); 
}

function draw() {
  background('white');
  adjustGridSystem();
  drawAxis();
  
  if (running && frameCount % revealEveryNFrames === 0) {
    if (theta > Math.PI/2 && visibleLines < nLines) {
      intersectingPoints.push(getPointOfIntersection(theta, visibleLines));
    }
    if (visibleLines < nLines) {
      visibleLines += 1;
    }
    if (theta > Math.PI/2) {
      theta -= deltaTheta;
    }
  }

  if (theta >= Math.PI/2 && visibleLines >= nLines) {
    setFinished(true);
  }

  drawStraightLines();
  drawRotatedLines();
  drawIntersectingPoints();
  drawCircle();
  setTitle();
}

function reset() {
  theta = Math.PI;
  visibleLines = 0;
  intersectingPoints = [];
}

function drawCircle() {
  push();
  noFill();
  stroke('gray'); 
  strokeWeight(1);
  circle(0,0,R*2);
  pop();
}

function getPointOfIntersection(theta, lineIndex) {
      let dx = -R + lineIndex * steps;
      let dy = Math.tan(theta) * dx;
      return {x:dx, y:dy};
}

function drawIntersectingPoints() {
  push();
  noStroke();
  fill('#b4049dff'); strokeWeight(2);
  for (let pt of intersectingPoints) {
    circle(pt.x, pt.y, 10);
  }
  pop();
}

function drawRotatedLines() {
  push();
  stroke('teal');
  strokeWeight(2);
  let stepTheta = Math.PI;
  while (stepTheta >= theta) {
    let dy = Math.sin(stepTheta) * R;
    let dx = Math.cos(stepTheta) * R;
    line(0,0,dx,dy);
    stepTheta -= deltaTheta;
  }
  pop(); 
}

function drawStraightLines() {
  push();
  stroke('purple');
  strokeWeight(2);
  for (let i=0; i <= visibleLines; i++) {
    let dx = -R + i*steps;
    line(dx,0,dx,lineHeight);
  }
  pop(); 
}

function drawAxis() {
  stroke('lightgray');
  strokeWeight(2);
  line(-width/2, 0, width/2, 0);
  line(0,-height/2,0,height/2-CANVAS_TOP_MARGIN);
}

function setTitle() {
  push();
  scale(1, -1);
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(30);
  text("Hippias Quadratrix", 0, -height/2);
  pop();
}


window.setup = setup;
window.draw = draw;