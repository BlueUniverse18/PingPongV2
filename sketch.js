let player, computerPaddle, wall, ball;
let edges;
let gamestate = "serve";
let screens = "menu";
let mode = "";
let btnAI, btnMultiplayer, btnPractice;
let ballSpeed = 13; // Adjusted for less speed
let playsco = 0, compsco = 0;

function setup() {
  createCanvas(600, 400);

  // Paddles and Ball
  player = createSprite(570, 200, 15, 100);
  player.shapeColor = color(0, 128, 255, 200); // Blue paddle

  computerPaddle = createSprite(30, 200, 15, 100);
  computerPaddle.shapeColor = color(255, 0, 0, 200); // Red paddle

  wall = createSprite(30, 200, 15, height);
  wall.shapeColor = color(128); // Wall for practice mode
  wall.visible = false;

  ball = createSprite(300, 200, 15, 15);
  ball.shapeColor = color(255);

  // Edges
  edges = createEdgeSprites();

  // Menu Buttons
  btnAI = createButton("Play AI");
  btnMultiplayer = createButton("Multiplayer");
  btnPractice = createButton("Practice");

  setupMenuButtons();
}

function draw() {
  background(20); // Dark background
  drawCourt();

  if (screens === "menu") {
    displayMenu();
  } else if (screens === "game") {
    playGame();
  } else if (screens === "practice") {
    practiceMode();
  }
}

function setupMenuButtons() {
  // Main menu buttons
  btnAI.position(width / 2 - 50, 150);
  btnMultiplayer.position(width / 2 - 50, 200);
  btnPractice.position(width / 2 - 50, 250);

  // Button Styles
  styleButtons([btnAI, btnMultiplayer, btnPractice]);

  // Button Actions
  btnAI.mousePressed(() => startGame("ai"));
  btnMultiplayer.mousePressed(() => startGame("multiplayer"));
  btnPractice.mousePressed(() => {
    screens = "practice";
    mode = "practice";
    resetGame();
    toggleButtons(false);
  });
}

function styleButtons(buttons) {
  buttons.forEach((btn) => {
    btn.style("font-size", "16px");
    btn.style("padding", "10px");
    btn.style("border-radius", "8px");
    btn.style("background", "linear-gradient(135deg, #ff7b00, #ffcc33)");
    btn.style("color", "white");
    btn.style("border", "none");
    btn.style("cursor", "pointer");
  });
}

function toggleButtons(show) {
  [btnAI, btnMultiplayer, btnPractice].forEach((btn) =>
    btn[show ? "show" : "hide"]()
  );
}

function drawCourt() {
  // Center Line
  stroke(200);
  line(width / 2, 0, width / 2, height);

  // Scores
  noStroke();
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(`Player: ${playsco}`, 450, 30);
  text(`Opponent: ${compsco}`, 150, 30);
}

function displayMenu() {
  fill(255);
  textSize(36);
  textAlign(CENTER);
  text("Ping Pong Game", width / 2, 100);
}

function startGame(selectedMode) {
  screens = "game";
  gamestate = "serve";
  mode = selectedMode;
  resetGame();
  toggleButtons(false);
}

function resetGame() {
  playsco = 0;
  compsco = 0;
  ball.x = width / 2;
  ball.y = height / 2;
  ball.velocityX = 0;
  ball.velocityY = 0;
  computerPaddle.visible = mode !== "practice";
}

function playGame() {
  drawSprites();

  // Serve
  if (gamestate === "serve") {
    serveBall();
    gamestate = "play";
  }

  // Player Movement
  player.y = mouseY;

  if (mode === "multiplayer") {
    // Multiplayer Controls
    if (keyIsDown(UP_ARROW)) computerPaddle.y -= 20; // Faster paddle movement
    if (keyIsDown(DOWN_ARROW)) computerPaddle.y += 20;
  } else if (mode === "ai") {
    moveComputer();
  }

  // Ball Mechanics
  ball.bounceOff(edges[2]);
  ball.bounceOff(edges[3]);
  ball.bounceOff(player);
  ball.bounceOff(computerPaddle);

  // Scoring
  if (ball.x > width) {
    compsco++;
    resetBall();
  } else if (ball.x < 0) {
    playsco++;
    resetBall();
  }

  // Game End
  if (playsco >= 21 || compsco >= 21) {
    gamestate = "end";
    endGame();
  }
}

function practiceMode() {
  drawSprites();

  wall.visible = true;

  // Serve
  if (gamestate === "serve") {
    serveBall();
    gamestate = "play";
  }

  // Player Movement
  player.y = mouseY;

  // Ball Mechanics
  ball.bounceOff(edges[2]);
  ball.bounceOff(edges[3]);
  ball.bounceOff(player);
  ball.bounceOff(wall);

  // No Scoring in Practice Mode
}

function moveComputer() {
  let speed = 10; // Hard AI speed
  if (computerPaddle.y < ball.y - 10) computerPaddle.y += speed;
  else if (computerPaddle.y > ball.y + 10) computerPaddle.y -= speed;
}

function serveBall() {
  ball.velocityX = ballSpeed * (random() > 0.5 ? 1 : -1);
  ball.velocityY = ballSpeed * random([-1, 1]);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.velocityX = ballSpeed * (random() > 0.5 ? 1 : -1);
  ball.velocityY = ballSpeed * random([-1, 1]);
}

function endGame() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 50);
  text(
    playsco > compsco ? "Player Wins!" : "Opponent Wins!",
    width / 2,
    height / 2
  );
  noLoop();
}
