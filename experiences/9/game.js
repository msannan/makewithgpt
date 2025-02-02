// Set up the canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Initialize game variables
let birdX = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.5;
const jumpVelocity = -10;
let score = 0;
let pipes = [];
let isGameOver = false;

// Define a class for Pipe objects
class Pipe {
  constructor(x, height) {
    this.x = x;
    this.width = 80;
    this.gapHeight = 150;
    this.topHeight = height;
    this.bottomHeight = canvas.height - height - this.gapHeight;
    this.color = 'green';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    ctx.fillRect(this.x, canvas.height - this.bottomHeight, this.width, this.bottomHeight);
  }

  isOffscreen() {
    return this.x + this.width < 0;
  }

  collidesWith(birdX, birdY) {
    return birdX + 20 > this.x && birdX - 20 < this.x + this.width &&
           (birdY - 20 < this.topHeight || birdY + 20 > canvas.height - this.bottomHeight);
  }
}

// Create initial pipes
for (let i = 0; i < 3; i++) {
  pipes.push(new Pipe(canvas.width + i * 300, Math.floor(Math.random() * (canvas.height - 200)) + 100));
}

// Handle player input
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !isGameOver) {
    birdVelocity = jumpVelocity;
  }
});

// Update function called on each frame
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update the bird position
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Draw the bird
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(birdX, birdY, 20, 0, 2 * Math.PI);
  ctx.fill();

  // Update and draw pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 5;
    pipes[i].draw();

    // Check for collision with bird
    if (pipes[i].collidesWith(birdX, birdY)) {
      isGameOver = true;
    }

    // Increment score if bird has passed the pipe
    if (!pipes[i].scored && pipes[i].x + pipes[i].width < birdX - 20) {
      score++;
      pipes[i].scored = true;
    }

    // Remove pipes that are offscreen
    if (pipes[i].isOffscreen()) {
      pipes.splice(i, 1);
      i--;
    }
  }

  // Add new pipe if needed
  if (pipes.length < 3 && pipes[pipes.length - 1].x < canvas.width - 300) {
    pipes.push(new Pipe(canvas.width, Math.floor(Math.random() * (canvas.height - 200)) + 100));
  }

// Draw the score
ctx.fillStyle = 'black';
ctx.font = '24px Arial';
ctx.fillText(`Score: ${score}`, 10, 30);

// Check for game over
if (birdY + 20 > canvas.height || birdY - 20 < 0 || isGameOver) {
  isGameOver = true;

  // Draw game over screen
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 50);

  // Handle restart
  document.addEventListener('keydown', event => {
	if (event.code === 'Enter') {
	  location.reload();
	}
  });

  return;
}

// Call the update function again on the next frame
requestAnimationFrame(update);
}

// Start the game loop
requestAnimationFrame(update);

