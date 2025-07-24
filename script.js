<script>
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let gridSize = 20;
  let tileCount = canvas.width / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let direction = "RIGHT";
  let nextDirection = "RIGHT";
  let food = { x: 5, y: 5 };
  let score = 0;
  let highScore = localStorage.getItem("snakeHighScore") || 0;
  let gameLoop;
  let speed = 150;
  let gamePaused = false;
  let wallsDeadly = true;

  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("highScore");
  const statusMsg = document.getElementById("statusMessage");
  const speedLevel = document.getElementById("speedLevel");
  const difficultySelect = document.getElementById("difficultySelect");
  const borderToggle = document.getElementById("borderToggle");

  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
  }

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  }

  function updateSpeed() {
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") {
      speed = 200;
      speedLevel.textContent = "Easy";
    } else if (difficulty === "normal") {
      speed = 150;
      speedLevel.textContent = "Normal";
    } else {
      speed = 100;
      speedLevel.textContent = "Hard";
    }
  }

  function updateGame() {
    if (gamePaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let head = { ...snake[0] };

    direction = nextDirection;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;

    // Wall collision
    if (wallsDeadly) {
      if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
      ) {
        endGame("You hit a wall!");
        return;
      }
    } else {
      head.x = (head.x + tileCount) % tileCount;
      head.y = (head.y + tileCount) % tileCount;
    }

    // Self collision
    for (let part of snake) {
      if (part.x === head.x && part.y === head.y) {
        endGame("You bit yourself!");
        return;
      }
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem("snakeHighScore", highScore);
      }
      placeFood();
    } else {
      snake.pop();
    }

    drawSquare(food.x, food.y, "red");

    for (let part of snake) {
      drawSquare(part.x, part.y, "lime");
    }
  }

  function startGame() {
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    scoreEl.textContent = score;
    highScoreEl.textContent = highScore;
    placeFood();
    updateSpeed();
    wallsDeadly = borderToggle.checked;
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
    statusMsg.textContent = "Game Started!";
    gamePaused = false;
  }

  function pauseGame() {
    gamePaused = !gamePaused;
    statusMsg.textContent = gamePaused ? "Game Paused" : "Game Resumed";
  }

  function resetGame() {
    clearInterval(gameLoop);
    statusMsg.textContent = "Game Reset";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    scoreEl.textContent = score;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
  });

  function endGame(msg) {
    clearInterval(gameLoop);
    statusMsg.textContent = `Game Over! ${msg}`;
  }

  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("pauseBtn").addEventListener("click", pauseGame);
  document.getElementById("resetBtn").addEventListener("click", resetGame);

  // Initial state
  highScoreEl.textContent = highScore;
  speedLevel.textContent = "Normal";
</script>
