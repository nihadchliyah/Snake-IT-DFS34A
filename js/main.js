const gameContainer = document.getElementById("game-container");

const CELL = 50;
const COLS = parseInt(gameContainer.style.width)  / CELL;
const ROWS = parseInt(gameContainer.style.height) / CELL;

let snake         = [];
let segments      = [];
let lastDirection = 'right';
let nextDirection = 'right';
let pendingGrowth = false;
let score         = 0;
let goldenTimer   = null;
let gameRunning   = false;

document.getElementById("snake").style.display = "none";
setInterval(loopGame, 200);
startGame();

function startGame() {
    snake         = [{ x: 50, y: 150 }];
    segments      = [];
    pendingGrowth = false;
    lastDirection = 'right';
    nextDirection = 'right';
    score         = 0;
    gameRunning   = true;
    clearTimeout(goldenTimer);

    document.querySelectorAll(".segment, .apple, .apple-golden, #gameover-overlay").forEach(function(el) { el.remove(); });
    document.getElementById("score-display").textContent = "0";
    document.getElementById("size-display").textContent  = "0";
    document.getElementById("golden-timer-wrap").style.visibility = "hidden";

    renderSnake();
    updateTail();
    generateApple();
    scheduleGoldenApple();
}

function loopGame() {
    if (!gameRunning) return;
    lastDirection = nextDirection;
    moveSnake(lastDirection);
    checkEatApple();
    document.getElementById("size-display").textContent = snake.length - 1;
    if (collideWithWall() || collideWithBody()) {
        GameOver();
    }
}

function saveDirection(dir) {
    if (dir === 'left'  && lastDirection === 'right') return;
    if (dir === 'right' && lastDirection === 'left')  return;
    if (dir === 'up'    && lastDirection === 'down')  return;
    if (dir === 'down'  && lastDirection === 'up')    return;
    nextDirection = dir;
}

var keyToDpad = { left: 'btn-left', right: 'btn-right', up: 'btn-up', down: 'btn-down' };

function highlightDpad(dir) {
    var btn = document.getElementById(keyToDpad[dir]);
    if (!btn) return;
    btn.classList.add("active");
    setTimeout(function() { btn.classList.remove("active"); }, 200);
}

document.addEventListener("keydown", function(e) {
    var map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    var dir = map[e.key];
    if (dir) {
        saveDirection(dir);
        highlightDpad(dir);
        e.preventDefault();
    }
});

function moveSnake(dir) {
    var newHead = { x: snake[0].x, y: snake[0].y };

    if (dir === 'left')  newHead.x -= CELL;
    if (dir === 'right') newHead.x += CELL;
    if (dir === 'up')    newHead.y -= CELL;
    if (dir === 'down')  newHead.y += CELL;

    if (!pendingGrowth) {
        var tail = segments.pop();
        tail.remove();
        snake.pop();
    }
    pendingGrowth = false;

    snake.unshift(newHead);
    addHeadDOM(newHead);
    updateTail();
}

function addHeadDOM(pos) {
    if (segments.length > 0) {
        var old = segments[0];
        old.classList.remove("head");
        old.className = old.className.replace(/dir-\w+/g, '').trim();
        old.classList.add("body");
        var toRemove = old.querySelectorAll(".eye, .tongue");
        toRemove.forEach(function(e) { e.remove(); });
    }
    var el = createSegment(pos, "head", lastDirection);
    gameContainer.appendChild(el);
    segments.unshift(el);
}

function renderSnake() {
    snake.forEach(function(pos, i) {
        var el = createSegment(pos, i === 0 ? "head" : "body", 'right');
        gameContainer.appendChild(el);
        segments.push(el);
    });
}

function createSegment(pos, type, dir) {
    var el = document.createElement("div");
    el.classList.add("segment", type);
    el.style.left = pos.x + "px";
    el.style.top  = pos.y + "px";

    if (type === "head") {
        el.classList.add("dir-" + dir);

        var eyeL = document.createElement("div");
        var eyeR = document.createElement("div");
        eyeL.classList.add("eye", "eye-left");
        eyeR.classList.add("eye", "eye-right");
        el.appendChild(eyeL);
        el.appendChild(eyeR);

        var tongue = document.createElement("div");
        tongue.classList.add("tongue");
        el.appendChild(tongue);
    }

    return el;
}

function updateTail() {
    segments.forEach(function(s) {
        if (!s.classList.contains("head")) {
            s.classList.remove("tail");
            s.style.clipPath = "";
        }
    });
    if (segments.length < 2) return;

    var tail = segments[segments.length - 1];
    var prev = segments[segments.length - 2];
    var tx = parseInt(tail.style.left), ty = parseInt(tail.style.top);
    var px = parseInt(prev.style.left), py = parseInt(prev.style.top);

    tail.classList.add("tail");
    if      (tx < px) tail.style.clipPath = "polygon(100% 0%, 100% 100%, 0% 50%)";
    else if (tx > px) tail.style.clipPath = "polygon(0% 0%, 0% 100%, 100% 50%)";
    else if (ty < py) tail.style.clipPath = "polygon(0% 100%, 100% 100%, 50% 0%)";
    else              tail.style.clipPath = "polygon(0% 0%, 100% 0%, 50% 100%)";
}

function triggerBulge() {
    if (segments.length < 2) return;
    var seg = segments[1];
    seg.classList.remove("bulge");
    void seg.offsetWidth;
    seg.classList.add("bulge");
    setTimeout(function() { seg.classList.remove("bulge"); }, 400);
}

function collideWithWall() {
    var x = snake[0].x, y = snake[0].y;
    return x < 0 || x >= COLS * CELL || y < 0 || y >= ROWS * CELL;
}

function collideWithBody() {
    var head = snake[0];
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function generateApple() {
    var pos = randomFreeCell();
    var apple = document.createElement("div");
    apple.classList.add("apple");
    apple.style.left = pos.x + "px";
    apple.style.top  = pos.y + "px";
    gameContainer.appendChild(apple);
}

function scheduleGoldenApple() {
    var delay = 8000 + Math.random() * 10000;
    goldenTimer = setTimeout(spawnGoldenApple, delay);
}

function spawnGoldenApple() {
    document.querySelectorAll(".apple-golden").forEach(function(el) { el.remove(); });
    var pos = randomFreeCell();
    var apple = document.createElement("div");
    apple.classList.add("apple-golden");
    apple.style.left = pos.x + "px";
    apple.style.top  = pos.y + "px";
    gameContainer.appendChild(apple);

    var wrap = document.getElementById("golden-timer-wrap");
    var bar  = document.getElementById("golden-timer-bar");
    wrap.style.visibility = "visible";
    bar.style.animation = "none";
    void bar.offsetWidth;
    bar.style.animation = "goldenShrink 5s linear forwards";

    setTimeout(function() {
        if (apple.parentNode) {
            apple.remove();
            wrap.style.visibility = "hidden";
            scheduleGoldenApple();
        }
    }, 5000);
}

function checkEatApple() {
    var head = snake[0];

    var apples = document.getElementsByClassName("apple");
    for (var i = 0; i < apples.length; i++) {
        if (head.x === parseInt(apples[i].style.left) && head.y === parseInt(apples[i].style.top)) {
            apples[i].remove();
            pendingGrowth = true;
            score += 1;
            document.getElementById("score-display").textContent = score;
            triggerBulge();
            generateApple();
            break;
        }
    }

    var golden = document.getElementsByClassName("apple-golden");
    for (var j = 0; j < golden.length; j++) {
        if (head.x === parseInt(golden[j].style.left) && head.y === parseInt(golden[j].style.top)) {
            golden[j].remove();
            document.getElementById("golden-timer-wrap").style.visibility = "hidden";
            score = score > 0 ? score * 10 : 10;
            document.getElementById("score-display").textContent = score;
            showBonus();
            scheduleGoldenApple();
            break;
        }
    }
}

function showBonus() {
    var bonus = document.createElement("div");
    bonus.classList.add("bonus-text");
    bonus.textContent = "x10";
    gameContainer.appendChild(bonus);
    setTimeout(function() { bonus.remove(); }, 900);
}

function randomFreeCell() {
    var pos;
    var allApples;
    do {
        pos = {
            x: Math.floor(Math.random() * COLS) * CELL,
            y: Math.floor(Math.random() * ROWS) * CELL
        };
        allApples = document.querySelectorAll(".apple, .apple-golden");
    } while (
        snake.some(function(s) { return s.x === pos.x && s.y === pos.y; }) ||
        Array.from(allApples).some(function(a) {
            return parseInt(a.style.left) === pos.x && parseInt(a.style.top) === pos.y;
        })
    );
    return pos;
}

function GameOver() {
    gameRunning = false;
    clearTimeout(goldenTimer);
    document.getElementById("golden-timer-wrap").style.visibility = "hidden";

    var finalScore = score;
    var finalSize  = snake.length - 1;

    document.getElementById("score-display").textContent = finalScore;
    document.getElementById("size-display").textContent  = finalSize;

    var overlay = document.createElement("div");
    overlay.id = "gameover-overlay";
    overlay.innerHTML =
        '<div id="gameover-box">' +
            '<h2>GAME OVER</h2>' +
            '<div class="go-stats">' +
                '<div class="go-stat">' +
                    '<span class="go-label">SCORE</span>' +
                    '<span class="go-val">' + finalScore + '</span>' +
                '</div>' +
                '<div class="go-stat">' +
                    '<span class="go-label">TAILLE</span>' +
                    '<span class="go-val">' + finalSize + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="go-buttons">' +
                '<button class="go-btn retry" onclick="startGame()">RETRY</button>' +
                '<button class="go-btn cancel" onclick="cancelGame()">ANNULER</button>' +
            '</div>' +
        '</div>';
    gameContainer.appendChild(overlay);
}

function cancelGame() {
    document.getElementById("gameover-overlay").remove();
    document.querySelectorAll(".segment, .apple, .apple-golden").forEach(function(el) { el.remove(); });
    snake = [];
    segments = [];
    gameRunning = false;
}