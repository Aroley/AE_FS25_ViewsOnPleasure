let moveX = 0;
let moveY = 0;
let snake = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  // Initially add the head to the snake array
  snake.push(new Segment(0, 0, 120, 1, 255));
}

function draw() {
  background("#35063E");
  fill(255);
  
  // Head movement (follows the mouse with delay)
  moveX += (mouseX - moveX) * 0.1;
  moveY += (mouseY - moveY) * 0.1;

  // Update the position of the head (first segment)
  snake[0].x = moveX;
  snake[0].y = moveY;
  
  // Move each segment after the first (following previous segment)
  for (let i = 1; i < snake.length; i++) {
    let currentSegment = snake[i];
    let previousSegment = snake[i - 1];
    
    // Move the current segment towards the previous one
    currentSegment.moveTo(previousSegment.x, previousSegment.y);
    currentSegment.display();
  }

  // Display the head (first segment)
  snake[0].display();
  
  // Add new segment (body) every few frames (snake grows)
  if (frameCount % 5 == 0 && snake.length < 6) {  // Adds a new segment every 5 frames, max length 6
    let newSegment = new Segment(snake[snake.length - 1].x, snake[snake.length - 1].y, 80, 2, 255);
    snake.push(newSegment);
  }
}

class Segment {
  constructor(x, y, size, position, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.position = position;
    this.color = color;
  }

  // Moves the segment closer to a target position (previous segment)
  moveTo(targetX, targetY) {
    this.x += (targetX - this.x) * 0.1;  // Delay effect
    this.y += (targetY - this.y) * 0.1;
  }

  display() {
    fill(this.color);
    switch (this.position) {
      case 1:  // Circle
        ellipse(this.x, this.y, this.size);
        break;
      case 2:  // Hexagon
        rect(this.x, this.y, this.size, this.size);
        break;
        case 3:  // Pentagon
        rect(this.x, this.y, this.size, this.size);
        break;
        case 4:  // Rectangle
        rect(this.x, this.y, this.size, this.size);
        break;
        case 5:  // Triangle
        rect(this.x, this.y, this.size, this.size);
        break;
    }
  }
}
