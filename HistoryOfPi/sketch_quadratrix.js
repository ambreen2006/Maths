import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_TOP_MARGIN } from '../Common/constants.js'; 
import { adjustGridSystem, animationButton, running, setFinished } from '../Common/common.js';

const R = 300;

let N = 2;
let nLines = 2**N;
let steps = R/nLines;
let deltaTheta = (Math.PI/2)/nLines;
let revealEveryNFrames = 10/nLines;     

let theta = Math.PI;
let visibleLines = 0;
let intersectingPoints = [];

let lineHeight;

let nLinesSlider, nLinesLabel, runningButton;

function setup() {
  let cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  let cnv_x = (windowWidth - width) / 4;
  let cnv_y = (windowHeight - height) / 2;
  lineHeight = height/2 - CANVAS_TOP_MARGIN;
  cnv.position(cnv_x, cnv_y);

  let button_x = CANVAS_WIDTH - 100;
  let button_y = CANVAS_TOP_MARGIN + 60;

  let label_x = button_x - 250;
  let label_y = button_y + 60;

  let slider_x = button_x - 150;
  let slider_y = label_y + 60;
  
  runningButton = animationButton(cnv_x, cnv_y, reset, {x: button_y, y: button_y}); 
  console.log("button ",runningButton);
  
  nLinesSlider = createSlider(2, 10, 5, 1);
  nLinesSlider.position(slider_x, slider_y);
  nLinesSlider.input(() => {
    N = nLinesSlider.value();
    reset();
  });

  // label under the slider
  nLinesLabel = createDiv("");
  nLinesLabel.style('color', 'rgba(0, 0, 0, 1)');
  nLinesLabel.style('font-family', 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Arial');
  nLinesLabel.style('font-size', '20px');
  nLinesLabel.position(label_x, label_y); 

  nLinesLabel.html("Number of Steps 2^N: N=" + N);   

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
    setFinished(true, runningButton);
  }

  drawStraightLines();
  drawRotatedLines();
  drawIntersectingPoints();
  drawCircle();
  setTitle();
}

function reset() {
  console.log("resetting to N=", N);
  theta = Math.PI;
  visibleLines = 0;
  intersectingPoints = [];

  nLines = 2**N;
  steps = R/nLines;
  deltaTheta = (Math.PI/2)/nLines;
  revealEveryNFrames = 10/nLines;
  
  nLinesLabel.html("Number of Steps 2^N: N=" + N);
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
  fill('#fb5ce5ff'); strokeWeight(2);
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