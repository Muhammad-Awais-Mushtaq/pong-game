const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 10;

// Left paddle
const leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };

// Right paddle (AI or player 2)
const rightPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };

// Ball properties
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 4, dy: 4 };

// Player scores
let player1Score = 0, player2Score = 0;

// Draw paddles
function drawPaddle(paddle) {
    ctx.fillStyle = "black";
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// Move paddles
function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Prevent paddles from going out of bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + paddleHeight > canvas.height) leftPaddle.y = canvas.height - paddleHeight;
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + paddleHeight > canvas.height) rightPaddle.y = canvas.height - paddleHeight;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1; // Reverse direction
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < leftPaddle.x + paddleWidth && ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) ||
        (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight)
    ) {
        ball.dx *= -1; // Reverse direction
    }

    // Ball out of bounds (scoring)
    if (ball.x - ball.radius < 0) {
        player2Score++;
        document.getElementById('player2Score').textContent = player2Score;
        resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
        player1Score++;
        document.getElementById('player1Score').textContent = player1Score;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // Send ball to the opposite player
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
}

// Update game state
function update() {
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

// Event listeners for paddle movement
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') rightPaddle.dy = -paddleSpeed;
    if (e.key === 'ArrowDown') rightPaddle.dy = paddleSpeed;
    if (e.key === 'w') leftPaddle.dy = -paddleSpeed;
    if (e.key === 's') leftPaddle.dy = paddleSpeed;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddle.dy = 0;
    if (e.key === 'w' || e.key === 's') leftPaddle.dy = 0;
});

// Start game
update();
