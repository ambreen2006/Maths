import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_TOP_MARGIN } from './constants.js'; 

export let running = true;
export let button;

let finished = false;

export function adjustGridSystem() {
  translate(width / 2, height / 2 + CANVAS_TOP_MARGIN / 2);
  scale(1, -1);
}

export function animationButton(cnvX, cnvY, resetFn) {
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

  button.position(width-100, 100);
  button.mousePressed(() => {
    if (finished) {
      if(resetFn) resetFn();
      finished = false;
    }
    running = !running;
    button.html(running ? '⏸ Pause' : '▶ Start');
  });
}

export function setFinished(value) {
  finished = value;
  running = false;
  if (button) {
    button.html('▶ Start');
  }
}