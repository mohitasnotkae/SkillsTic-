/* ===============================
   SKILLSTIC – GAME SCRIPT
   CORE LOGIC (UPDATED WALLET)
   =============================== */

/* ---------- GLOBAL ---------- */
let wallet = 1000;
let gameStarted = false;
let gameOver = false;
let currentContest = null;

let board = ["","","","","","","","",""];
let player = "X";
let xMoves = [];
let oMoves = [];

let timer = null;
let timeLeft = 15;

/* ---------- SOUND ---------- */
const clickSound = new Audio("click.mp3");
const winSound = new Audio("win.mp3");

clickSound.preload = "auto";
winSound.preload = "auto";

/* ---------- AUDIO UNLOCK (MOBILE FIX) ---------- */
document.body.addEventListener("click", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(()=>{});

  winSound.play().then(() => {
    winSound.pause();
    winSound.currentTime = 0;
  }).catch(()=>{});
}, { once: true });

/* ---------- PAYOUT CALCULATOR ---------- */
function calculatePayout(entry, type) {
  const total = entry * 2;
  const gst = Math.floor(total * 0.28);

  let winner = 0;
  let loser = 0;

  if (type === "onlyWinner") {
    winner = Math.floor(total * 0.72);
  }

  if (type === "winnerLoser") {
    winner = Math.floor(total * 0.62);
    loser = Math.floor(total * 0.10);
  }

  return { winner, loser, gst };
}

/* ---------- CONTESTS ---------- */
const contests = [
  { entry: 49,  type: "onlyWinner" },
  { entry: 99,  type: "onlyWinner" },
  { entry: 199, type: "onlyWinner" },
  { entry: 299, type: "winnerLoser" },
  { entry: 399, type: "winnerLoser" },
  { entry: 499, type: "winnerLoser" },
  { entry: 699, type: "winnerLoser" },
  { entry: 799, type: "winnerLoser" },
  { entry: 899, type: "winnerLoser" },
  { entry: 1000,type: "winnerLoser" }
];

const contestList = document.getElementById("contestList");
const walletEl = document.getElementById("wallet");

/* ---------- LOAD WALLET AFTER PAGE LOAD ---------- */
document.addEventListener("DOMContentLoaded", () => {
  wallet = parseInt(localStorage.getItem("wallet")) || 0;
  walletEl.innerText = wallet;
  loadContests();

  // SAFETY: ensure board exists when game opens
  createBoard();
});

/* ---------- LOAD LOBBY ---------- */
function loadContests(){
  contestList.innerHTML = "";

  contests.forEach((c, i) => {
    const payout = calculatePayout(c.entry, c.type);

    contestList.innerHTML += `
      <div class="card">
        <div class="info">
  🏆 Winner <b>₹${payout.winner}</b><br>
  🛡 Loser <b>₹${payout.loser === 0 ? "—" : payout.loser}</b><br>
  🏛 GST <b>₹${payout.gst}</b>
</div>

<button class="joinBtn" onclick="startGame(${i})">
  ENTRY ₹${c.entry}
</button>

      </div>
    `;
  });
}

/* ---------- START GAME ---------- */
function startGame(i){

  /* 🔐 LOGIN CHECK */
  if(localStorage.getItem("skillsTic_loggedIn") !== "yes"){
    alert("Please login first");
    return;
  }

  if(gameStarted) return;

  const c = contests[i];

  /* 💰 WALLET CHECK */
  if(wallet < c.entry){
    alert("Insufficient balance");
    return;
  }

  /* 💳 DEDUCT ENTRY (ONCE) */
  wallet -= c.entry;
  walletEl.innerText = wallet;
  localStorage.setItem("wallet", wallet);

  currentContest = {
  ...c,
  payout: calculatePayout(c.entry, c.type)
};
  gameStarted = true;
  gameOver = false;
  player = "X";

  board.fill("");
xMoves = [];
oMoves = [];

createBoard();

  document.getElementById("status").innerText = "";
  document.getElementById("turn").innerText = "Your Turn";

  contestList.classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  startTimer();
}

/* ---------- PLAY ---------- */
function play(i, el){
  if(!gameStarted || gameOver) return;
  if(board[i] !== "") return;

  if(player === "X"){
    if(xMoves.length === 3){
      let old = xMoves.shift();
      board[old] = "";
      document.querySelectorAll(".cell")[old].innerText = "";
    }
    xMoves.push(i);
  } else {
    if(oMoves.length === 3){
      let old = oMoves.shift();
      board[old] = "";
      document.querySelectorAll(".cell")[old].innerText = "";
    }
    oMoves.push(i);
  }

  board[i] = player;
  el.innerText = player;
clickSound.currentTime = 0;
clickSound.play();

  if(checkWin()){
    finishGame(player);
    return;
  }

  player = player === "X" ? "O" : "X";
  document.getElementById("turn").innerText = player + "'s Turn";
  startTimer();
}

/* ---------- CHECK WIN ---------- */
function checkWin(){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === player));
}

/* ---------- FINISH GAME ---------- */
function finishGame(winner){
stopTimer();

  gameOver = true;
  gameStarted = false;

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  wins.forEach(w=>{
    if(w.every(i => board[i] === winner)){
      w.forEach(i=>{
        document.querySelectorAll(".cell")[i].classList.add("win");
      });
    }
  });

  if (winner === "X") {
    wallet += currentContest.payout.winner;
  } else {
    wallet += currentContest.payout.loser;
  }

  walletEl.innerText = wallet;
  localStorage.setItem("wallet", wallet);

  winSound.currentTime = 0;
  winSound.play();

  document.getElementById("status").innerText =
`${winner} WINS!
Winner ₹${currentContest.payout.winner}
Loser ₹${currentContest.payout.loser}
GST ₹${currentContest.payout.gst}`;
}

/* ---------- EXIT ---------- */
function backToLobby(){
stopTimer();
  gameStarted = false; document.getElementById("game").classList.add("hidden");
  contestList.classList.remove("hidden");
}

/* ===== HEADER BUTTON FUNCTIONS ===== */

function goDeposit(){
  window.location.href = "deposit.html";
}

function goWithdraw(){
  window.location.href = "withdraw.html";
}

function logout(){
  if(!confirm("Are you sure you want to logout?")) return;

  localStorage.removeItem("skillsTic_loggedIn");

  gameStarted = false;
  gameOver = true;
 document.getElementById("game").classList.add("hidden");
  contestList.classList.remove("hidden");

  location.reload();
}
/* ---------- CREATE BOARD ---------- */
function createBoard(){
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  for(let i = 0; i < 9; i++){
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => play(i, cell);
    boardEl.appendChild(cell);
  }
}
function restartGame(){
  if(!currentContest) return;
stopTimer();
  gameStarted = true;
  gameOver = false;
  player = "X";

  board = ["","","","","","","","",""];
  xMoves = [];
  oMoves = [];

  document.getElementById("status").innerText = "";
  document.getElementById("turn").innerText = "Your Turn";

  createBoard();
  startTimer();
}
function startTimer(){
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("time").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;

    if(timeLeft === 5){
      // optional warning sound later
    }

    if(timeLeft <= 0){
      clearInterval(timer);
      finishGame(player === "X" ? "O" : "X");
    }
  }, 1000);
}

function stopTimer(){
  clearInterval(timer);
}
