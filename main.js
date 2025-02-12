let protagonist;
let smallShapes = [];

function setup() {
  createCanvas(800, 800);
  protagonist = new Protagonist(width / 2, height / 2);
}

function draw() {
  background(255);

  // Display grid
  drawGrid();

  // Update and draw big circle
  protagonist.update(smallShapes);
  protagonist.display();

  // Draw all small circles and squares
  for (let shape of smallShapes) {
    shape.display();
  }
}

// Draw a simple grid
function drawGrid() {
  stroke(200,200,200,60);
  for (let i = 0; i < width; i += 40) {
    line(i, 0, i, height);
  }
  for (let i = 0; i < height; i += 40) {
    line(0, i, width, i);
  }
}

// Handle mouse clicks
function mousePressed() {
  if (mouseButton === LEFT) {
    // Add small circle on left click
    smallShapes.push(new HappyObject(mouseX, mouseY));
  } else if (mouseButton === RIGHT) {
    // Add small square on right click
    smallShapes.push(new SadObject(mouseX, mouseY));
  }
}

// Big Circle class that gravitates toward or away from points
class Protagonist {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = 1;
  }

  update(shapes) {
    let forceX = 0;
    let forceY = 0;

    // Calculate the combined gravitational force from all shapes
    for (let shape of shapes) {
      let dx = shape.x - this.x;
      let dy = shape.y - this.y;
      let distance = dist(this.x, this.y, shape.x, shape.y);

      if (distance === 0) {
        continue; // Avoid division by zero
      }

      let force = 5 / (distance * distance); // Inverse square law (strength of gravity)

      if (shape instanceof HappyObject) {
        forceX += force * (dx / distance);
        forceY += force * (dy / distance);
      } else if (shape instanceof SadObject) {
        forceX -= force * (dx / distance); // Pull away from squares
        forceY -= force * (dy / distance); // Pull away from squares
      }
    }

    // Apply the force to move the big circle
    this.x += forceX * this.speed;
    this.y += forceY * this.speed;
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// Small Circle class
class HappyObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
  }

  display() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// Small Square class
class SadObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  display() {
    fill(0, 255, 0);
    rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}
