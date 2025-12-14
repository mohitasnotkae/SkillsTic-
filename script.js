let wallet = 1000;
let gameStarted = false;
let gameOver = false;
let currentContest = null;

let board = ["","","","","","","","",""];
let player = "X";
let xMoves = [];
let oMoves = [];

const contests = [
  {entry:19, winner:26, loser:10, dev:2},
  {entry:50, winner:100, loser:20, dev:5},
  {entry:99, winner:135, loser:52, dev:10},
  {entry:199, winner:272, loser:105, dev:21},
  {entry:399, winner:546, loser:210, dev:42},
  {entry:699, winner:1000, loser:367, dev:31}
];

const contestList = document.getElementById("contestList");
const walletEl = document.getElementById("wallet");

function loadContests(){
  contestList.innerHTML = "";
  contests.forEach((c,i)=>{
    contestList.innerHTML += `
      <div class="contest">
        <div>
          <span>🏆 Winner ₹${c.winner}</span>
          <span>🛡 Loser ₹${c.loser}</span>
          <span>🤝 Dev ₹${c.dev}</span>
        </div>
        <button class="join" onclick="startGame(${i})">
          ENTRY ₹${c.entry}
        </button>
      </div>
    `;
  });
}

loadContests();

function startGame(i){
  if(gameStarted) return;

  const c = contests[i];
  if(wallet < c.entry){
    alert("Insufficient balance");
    return;
  }

  wallet -= c.entry;
  walletEl.innerText = wallet;

  currentContest = c;
  gameStarted = true;
  gameOver = false;
  player = "X";

  board.fill("");
  xMoves = [];
  oMoves = [];

  document.querySelectorAll(".cell").forEach(c => c.innerText = "");
  document.getElementById("status").innerText = "";
  document.getElementById("turn").innerText = "Your Turn";

  contestList.classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function play(i,el){
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

function checkWin(){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === player));
}

function finishGame(winner){
  gameOver = true;
  gameStarted = false;

  wallet += currentContest.winner;
  walletEl.innerText = wallet;

  document.getElementById("status").innerText =
    `${winner} WINS! Winner ₹${currentContest.winner} | Loser ₹${currentContest.loser} | Dev ₹${currentContest.dev}`;
}

function exitGame(){
  gameStarted = false;
  document.getElementById("game").classList.add("hidden");
  contestList.classList.remove("hidden");
}
