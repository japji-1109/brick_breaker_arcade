function showSection(id){
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const gameArea = document.getElementById("gameArea");
let gameOver = false;

let ballX = 290, ballY = 200;
let dy = -3, dx = 3;

let paddleX = 250;
let score = 0; 
let lives = 3; 
let level=1;

let bricks = [];

function createBricks(){
    bricks.forEach(b => b.remove());
    bricks = [];

    for(let row=0; row<3+level; row++){
        for(let col=0; col<7; col++){
            let brick = document.createElement("div");
            brick.classList.add("brick");
            brick.style.left = (col*80+20) + "px";
            brick.style.top = (row*30+20) + "px";

            gameArea.appendChild(brick);
            bricks.push(brick);
        }
    }
}

createBricks();

function update(){

    if(gameOver) return;

    ballX += dx;
    ballY += dy;

    /* Wall collision */
    if(ballX <= 0 || ballX + 15 >= gameArea.offsetWidth){
        dx = -dx;
    }

    if(ballY <= 0){
        dy = -dy;
    }

    let paddleTop = paddle.offsetTop;
    let paddleLeft = paddle.offsetLeft;
    let paddleRight = paddleLeft + paddle.offsetWidth;

    if(ballY + 15 >= paddleTop){

        if(ballX + 15 >= paddleLeft && ballX <= paddleRight){
            dy = -dy;
            ballY = paddleTop - 15;
        }
        else if(ballY + 15 >= gameArea.offsetHeight){
            lives--;
            document.getElementById("lives").innerText = lives;

            if(lives <= 0 && !gameOver) {
                gameOver = true;
                alert("Game Over!");
                saveScore();
                return;
            }

            ballX = 290;
            ballY = 200;
            dx = 3;
            dy = -3;
        }
    }

    bricks.forEach((brick, index) => {
        let bx = brick.offsetLeft;
        let by = brick.offsetTop;
        let bw = brick.offsetWidth;
        let bh = brick.offsetHeight;

        if(ballX + 15 > bx &&
           ballX < bx + bw &&
           ballY + 15 > by &&
           ballY < by + bh){

            dy = -dy;

            brick.remove();
            bricks.splice(index, 1);

            score += 10;
            document.getElementById("score").innerText = score;

            if(bricks.length === 0){
                level++;
                document.getElementById("level").innerText = level;
                createBricks();

                ballX = 290;
                ballY = 350;
                dx += 1; // increase speed
            }
        }
    });

    /* Update positions */
    ball.style.left = ballX + "px";
    ball.style.top  = ballY + "px";
    paddle.style.left = paddleX + "px";

    requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
    if(e.key === "ArrowRight" && paddleX + paddle.offsetWidth < gameArea.offsetWidth){
        paddleX += 20;
    }
    if(e.key === "ArrowLeft" && paddleX > 0){
        paddleX -= 20;
    }
});

update();

function restartGame(){
    location.reload()
    update();
}

function saveScore(){
    let name = prompt("Enter your name: ");
    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];
    data.push({name, score});
    data.sort((a,b) => b.score-a.score);
    localStorage.setItem("leaderboard", JSON.stringify(data));
    loadLeaderboard();
}

function loadLeaderboard(){
    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let body = document.getElementById("leaderboardBody");
    body.innerHTML = "";
    data.forEach(p => {
        body.innerHTML += `<tr><td>${p.name}</td><td>${p.score}</td></tr>`;
    });
}
loadLeaderboard();

function addComment(){
    let name = document.getElementById("username").value;
    let comment = document.getElementById("comment").value;
    let data = JSON.parse(localStorage.getItem("comments")) || [];
    data.push({name, comment});
    localStorage.setItem("comments", JSON.stringify(data));
    loadComments();
}

function loadComments(){
    let data = JSON.parse(localStorage.getItem("comments")) || [];
    let section = document.getElementById("commentSection");
    section.innerHTML = "";
    data.forEach(c =>{
        section.innerHTML += `<p><b>${c.name}:</b> ${c.comment}</p>`;
    });
}
loadComments();