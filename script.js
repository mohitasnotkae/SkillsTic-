/* ===============================
   SKILLSTIC – GAME SCRIPT
   CORE LOGIC UNCHANGED
   =============================== */

let wallet = 1000;
let gameStarted = false;
let gameOver = false;
let currentContest = null;

let board = ["","","","","","","","",""];
let player = "X";
let xMoves = [];
let oMoves = [];

/* ---------- CONTESTS ---------- */
const contests = [
  {entry:19,  winner:26,  loser:10,  dev:2},
  {entry:50,  winner:100, loser:20,  dev:5},
  {entry:99,  winner:135, loser:52,  dev:10},
  {entry:199, winner:272, loser:105, dev:21},
  {entry:399, winner:546, loser:210, dev:42},
  {entry:699, winner:1000,loser:367, dev:31}
];

const contestList = document.getElementById("contestList");
const walletEl = document.getElementById("wallet");

/* ---------- LOAD LOBBY ---------- */
function loadContests(){
  contestList.innerHTML = "";
  contests.forEach((c,i)=>{
    contestList.innerHTML += `
      <div class="contest">
        <div>
          🏆 Winner ₹${c.winner}<br>
          🛡 Loser ₹${c.loser}<br>
          🤝 Dev ₹${c.dev}
        </div>
        <button class="join" onclick="startGame(${i})">
          ENTRY ₹${c.entry}
        </button>
      </div>
    `;
  });
}
loadContests();

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

  /* 💳 DEDUCT ONCE */
  wallet -= c.entry;
  walletEl.innerText = wallet;

  currentContest = c;
  gameStarted = true;
  gameOver = false;
  player = "X";

  board.fill("");
  xMoves = [];
  oMoves = [];

  document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
  document.getElementById("status").innerText = "";
  document.getElementById("turn").innerText = "Your Turn";

  contestList.classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
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

  if(checkWin()){
    finishGame(player);
    return;
  }

  player = player === "X" ? "O" : "X";
  document.getElementById("turn").innerText = player + "'s Turn";
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
  gameOver = true;
  gameStarted = false;

  /* 💸 CORRECT PAYOUT */
  if(winner === "X"){
    wallet += currentContest.winner;
  } else {
    wallet += currentContest.loser;
  }

  walletEl.innerText = wallet;

  document.getElementById("status").innerText =
    `${winner} WINS!\nWinner ₹${currentContest.winner} | Loser ₹${currentContest.loser} | Dev ₹${currentContest.dev}`;
}

/* ---------- EXIT ---------- */
function exitGame(){
  gameStarted = false;
  document.getElementById("game").classList.add("hidden");
  contestList.classList.remove("hidden");
}
