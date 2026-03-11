let gameContainer = document.getElementById("game-container");
let lastDirection = 'right';

const containerSize = [
    gameContainer.style.width  ? parseInt(gameContainer.style.width)  : 0,
    gameContainer.style.height ? parseInt(gameContainer.style.height) : 0
];
const snakeSize = 50;


let snake    = [{ x: 0, y: 0 }];
let segments = [];

setInterval(loopGame, 300);
startGame();


function startGame() {
    snake    = [{ x: 0, y: 0 }];
    segments = [];
    document.querySelectorAll(".segment, .apple").forEach(el => el.remove());
    renderSnake();
    generateApple();
}

function resetGame() {
    startGame();
}

function loopGame() {
    moveSnake(lastDirection);
    checkEatApple();
    if (collideWithWall()) {
        GameOver();
    }
}


document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowLeft":  saveDirection('left');  break;
        case "ArrowRight": saveDirection('right'); break;
        case "ArrowUp":    saveDirection('up');    break;
        case "ArrowDown":  saveDirection('down');  break;
    }
});

function saveDirection(event) {
    lastDirection = event;
}


function moveSnake(dir) {

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir === 'left')  snakeX -= snakeSize;
    if (dir === 'right') snakeX += snakeSize;
    if (dir === 'up')    snakeY -= snakeSize;
    if (dir === 'down')  snakeY += snakeSize;

    let newHead = { x: snakeX, y: snakeY };

  
    const apples = document.getElementsByClassName("apple");
    let ate = false;
    for (let apple of apples) {
        if (snakeX === parseInt(apple.style.left) && snakeY === parseInt(apple.style.top)) {
            ate = true;
            break;
        }
    }

    if (ate) {
       
    } else {
    
        const tailDOM = segments.pop();
        tailDOM.remove();
        snake.pop();
    }

    
    snake.unshift(newHead);
    addHeadDOM(newHead);
}


function addHeadDOM(pos) {
    
    if (segments.length > 0) {
        segments[0].style.backgroundColor = 'green';
    }

    const el = document.createElement("div");
    el.classList.add("segment");
    el.style.position        = "absolute";
    el.style.width           = snakeSize + "px";
    el.style.height          = snakeSize + "px";
    el.style.backgroundColor = "lime"; 
    el.style.left            = pos.x + "px";
    el.style.top             = pos.y + "px";
    gameContainer.appendChild(el);

    segments.unshift(el);
}

function renderSnake() {
    snake.forEach((pos, i) => {
        const el = document.createElement("div");
        el.classList.add("segment");
        el.style.position        = "absolute";
        el.style.width           = snakeSize + "px";
        el.style.height          = snakeSize + "px";
        el.style.backgroundColor = i === 0 ? "lime" : "green";
        el.style.left            = pos.x + "px";
        el.style.top             = pos.y + "px";
        gameContainer.appendChild(el);
        segments.push(el);
    });
}


function collideWithWall() {
    const head = snake[0];
    return (
        head.x < 0 || head.x + snakeSize > containerSize[0] ||
        head.y < 0 || head.y + snakeSize > containerSize[1]
    );
}

function GameOver() {
    alert("Game Over!");
    resetGame();
}


function generateApple() {
    const apple = document.createElement("div");
    apple.classList.add("apple");
    apple.style.left = Math.floor(Math.random() * (containerSize[0] / snakeSize)) * snakeSize + "px";
    apple.style.top  = Math.floor(Math.random() * (containerSize[1] / snakeSize)) * snakeSize + "px";
    gameContainer.appendChild(apple);
}

function checkEatApple() {
    const head   = snake[0];
    const apples = document.getElementsByClassName("apple");

    for (let apple of apples) {
        const ax = parseInt(apple.style.left);
        const ay = parseInt(apple.style.top);

        if (head.x === ax && head.y === ay) {
            gameContainer.removeChild(apple);
            generateApple();
            
            break;
        }
    }
}