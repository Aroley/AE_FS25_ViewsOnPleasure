let moveX;
let moveY;
let snake = [];
let goal = null;
let idleOffsetX = 0;
let idleOffsetY = 0;

let intellectual;
let physical;
let social;
let grid;

function preload() {
  intellectual = loadImage('intellectual.png');
  physical = loadImage('physical.png');
  social = loadImage('social.png');
  grid = loadImage('grid.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  moveX = width / 2;
  moveY = height / 2-height/6;

  // Initial colors for the snake
  let colors = ['#ffffff', '#FF9BC5', '#CD9BFF', '#8C9FFF', '#FF8480'];
  for (let i = 0; i < colors.length; i++) {
    snake.push(new Segment(0, 0, 120, i + 1, colors[i])); 
  }
}

function draw() {
  background("#4C00B0");

  // Background grid
  let gridAspect = grid.width / grid.height;
  let canvasAspect = width / height;

  let sx, sy, sWidth, sHeight;

  if (gridAspect > canvasAspect) {
    sWidth = grid.height * canvasAspect;
    sHeight = grid.height;
    sx = (grid.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = grid.width;
    sHeight = grid.width / canvasAspect;
    sx = 0;
    sy = (grid.height - sHeight) / 2;
  }

  image(grid, 0, 0, width, height, sx, sy, sWidth, sHeight);

  // Icons
  image(intellectual, width*0.23, height*0.19, 140, 140);
  image(social, width*0.44, height*0.79, 140, 140);
  image(physical, width*0.77, height*0.3, 140, 140);

  fill(255);


  // Move snake towards goal
  if (goal) {
    moveX += (goal.x - moveX) * 0.05;
    moveY += (goal.y - moveY) * 0.05;
  } else {
    // Idling
    idleOffsetX = cos(frameCount * 0.05) * 20;
    idleOffsetY = sin(frameCount * 0.05) * 20;
    moveX += idleOffsetX;
    moveY += idleOffsetY;
  }

  // Check for collision with the goal
  if (goal && dist(moveX, moveY, goal.x, goal.y) < snake[0].size / 2) {
    collectGoal();
  }

  // Update the position of head
  snake[0].x = moveX;
  snake[0].y = moveY;

  // Segment movement
  for (let i = 1; i < snake.length; i++) {
    let currentSegment = snake[i];
    let previousSegment = snake[i - 1];

    // Move the current segment towards the previous one
    currentSegment.moveTo(previousSegment.x, previousSegment.y);
    currentSegment.display();
  }

  // Display snake head
  snake[0].display();

  // Add snake body
  if (frameCount % 5 == 0 && snake.length < 6) { 
    let newSegment = new Segment(snake[snake.length - 1].x, snake[snake.length - 1].y, 80, snake.length + 1, snake[snake.length - 1].color);
    snake.push(newSegment);
  }

  // Draw snake
  for (let i = snake.length - 1; i >= 0; i--) {
    snake[i].display();
  }

  // Draw the goal
  if (goal) {
    goal.display();
  }


  // Texts
  fill(255);
  textSize(32);
  textAlign(LEFT);
  text('NEAR SPHERE\nVIEWS ON PLEASURE', 50, 50);
  textAlign(RIGHT);
  text('ARON EGGENBERGER\n2025', width - 50, height - 80);
}



function collectGoal() {
  // Change the color of the hexagon (second segment)
  if (snake.length > 1) {
    snake[4].color = snake[3].color;  // Color shift
    snake[3].color = snake[2].color;  // Color shift
    snake[2].color = snake[1].color;  // Color shift
    snake[1].color = goal.color;  // Hexagon becomes goal color
  }

  // Remove goal
  goal = null;
}

function mousePressed() {
  // Create a new goal on click
  goal = new Goal(mouseX, mouseY);
}

class Goal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;

    // Calculate the angle of the goal relative to the center of the canvas
    let angle = atan2(this.y - height / 2, this.x - width / 2);

    // Map the angle to a hue value (0 to 360)
    let hue = map(angle, -PI, PI, 0, 360);

    // Set saturation and brightness for vivid colors
    let saturation = 100;  // Full saturation for vivid colors
    let brightness = 100;  // Full brightness for vibrant colors

    // Set the color in HSB mode
    colorMode(HSB, 360, 100, 100);
    this.color = color(hue, saturation, brightness);

    // Switch back to RGB mode for drawing
    colorMode(RGB, 255, 255, 255);
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}




class Segment {
  constructor(x, y, size, position, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.position = position;
    this.color = color;
    this.angle = 0;  // Angle for rotation
  }

  // Move segment to target
  moveTo(targetX, targetY) {
    this.x += (targetX - this.x) * 0.1;  // Delay effect
    this.y += (targetY - this.y) * 0.1;

    // Angle points at target
    this.angle = atan2(targetY - this.y, targetX - this.x);
  }

  display() {
    fill(this.color);

    // Drawing shapes in the reversed order
    switch (this.position) {
      case 5:  // Triangle 
        this.drawTriangle(this.x, this.y, this.size);
        break;
      case 4:  // Rectangle 
        this.drawRectangle(this.x, this.y, this.size * 1.1);
        break;
      case 3:  // Pentagon 
        this.drawPentagon(this.x, this.y, this.size);
        break;
      case 2:  // Hexagon 
        this.drawHexagon(this.x, this.y, this.size);
        break;
      case 1:  // Circle
        fill(255);  // Circle is always white
        ellipse(this.x, this.y, this.size * 1.6);
        break;
    }
  }

  // Hexagon
  drawHexagon(x, y, size) {
    push();
    translate(x, y);
    rotate(this.angle);  // Rotation based on snake's movement
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let xOffset = cos(angle) * size;
      let yOffset = sin(angle) * size;
      vertex(xOffset, yOffset);
    }
    endShape(CLOSE);
    pop();
  }

  // Pentagon 
  drawPentagon(x, y, size) {
    push();
    translate(x, y);
    rotate(this.angle);  // Rotation based on snake's movement
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let xOffset = cos(angle) * size;
      let yOffset = sin(angle) * size;
      vertex(xOffset, yOffset);
    }
    endShape(CLOSE);
    pop();
  }

  // Triangle
  drawTriangle(x, y, size) {
    push();
    translate(x, y);
    rotate(this.angle);  // Rotation based on snake's direction
    beginShape();
    for (let i = 0; i < 3; i++) {
      let angle = TWO_PI / 3 * i;
      let xOffset = cos(angle) * size;
      let yOffset = sin(angle) * size;
      vertex(xOffset, yOffset);
    }
    endShape(CLOSE);
    pop();
  }

  // Rectangle
  drawRectangle(x, y, size) {
    push();
    translate(x, y);
    rotate(this.angle);  // Rotation based on snake's direction
    rect(0, 0, size * 1.3);
    pop();
  }
}

