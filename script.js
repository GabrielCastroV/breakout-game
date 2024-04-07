const $canvas = document.querySelector('canvas');
const $bricks = document.querySelector('#bricks')
const $bg = document.querySelector('#bg')
const $sprite = document.querySelector('#sprite')

const ctx = $canvas.getContext('2d');

// tamaño del tablero
const screenWidht = window.innerWidth
const screenHeight = window.innerHeight

$canvas.width = screenWidht < 430 ? screenWidht : 430
$canvas.height = screenHeight

// tamaño de pelota

const ballRadius = 4;

// posicion de la pelota al inicio

let x = $canvas.width / 2; // centro en el eje x
let y = $canvas.height - 30;

// velocidad y sentido de la pelota 

let dx = 3
let dy = -2 + Math.random()

// variables de la barra 

const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = ($canvas.width - paddleWidth) / 2
let paddleY = $canvas.height - paddleHeight - 10

let rightKeyPressed = false;
let leftKeyPressed = false;

// variables de los ladrillos

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = $canvas.width / 16;
const brickHeight = $canvas.height / 40;
const brickPadding = 1;
const brickOffSetTop = 80;
const brickOffSetleft = $canvas.width / 12;
const bricks= [];
const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}



for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [] // iniciamos en array vacio
    for (let r = 0; r < brickRowCount; r++) {
        // calculamos la posicion del ladrillo en la pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffSetleft;
        const brickY = r * (brickHeight + brickPadding) + brickOffSetTop;
        // asignar color random al ladrillo
        const random = Math.floor(Math.random() * 8) // genera un numero del 0 al 7

        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        }
    }   
}



function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.fillStyle = 'yellow'
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight)
}
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r];
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue

            // ctx.fillStyle = 
            // ctx.rect(
            //     currentBrick.x,
            //     currentBrick.y,
            //     brickWidth,
            //     brickHeight,
            // )
            // ctx.strokeStyle = 'gray'
            // ctx.stroke()
            // ctx.fill()

            const clipX = currentBrick.color * 32
            ctx.drawImage(
                $bricks,
                clipX,
                0,
                31,
                14,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r];
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue

            const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth;
            const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight;
            

            if (isBallSameXAsBrick && isBallSameYAsBrick) {
                dy *= -1;
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }        
}
function ballMovement() {
    if (
        x + dx > $canvas.width - ballRadius ||
        x + dx < ballRadius
    ) {
        dx *= -1
    }

    if (y + dy < ballRadius) {
        dy *= -1
    }
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

    const isBallTouchingPaddle = y + dy >= paddleY;

    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy *= -1;
    }else if (y + dy > $canvas.height - ballRadius) {
        document.location.reload();
    }

    x += dx
    y += dy
}
function cleanCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
}
function paddleMovement() {
    if (rightKeyPressed && $canvas.width - paddleWidth > paddleX) {
        paddleX += 7;
    } else if (leftKeyPressed && paddleX > 0) {
        paddleX -= 7
    }
}
function initEvent() {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchend', touchEndHandler, { passive: true });

    function keyDownHandler(event) {
        const { key } = event;

        if (key === 'Right' || key === 'ArrowRight' || key === 'd') {
            rightKeyPressed = true;
        } else  if (key === 'Left' || key === 'ArrowLeft' || key === 'a') {
            leftKeyPressed = true;
        }
    }
    function keyUpHandler(event) {
        const { key } = event;

        if (key === 'Right' || key === 'ArrowRight' || key === 'd') {
            rightKeyPressed = false;
        } else  if (key === 'Left' || key === 'ArrowLeft' || key === 'a') {
            leftKeyPressed = false;
        }
    }
    function touchStartHandler(e) {
        const touchX = e.touches[0].clientX;
        if (touchX > $canvas.width / 2) {
          rightKeyPressed = true;
        } else {
          leftKeyPressed = true;
        }
      }
  
      function touchEndHandler() {
        rightKeyPressed = false;
        leftKeyPressed = false;
      }

}

function draw() {
    cleanCanvas();
    drawBall();
    drawPaddle();
    drawBricks();

    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw)
}

draw();
initEvent();
