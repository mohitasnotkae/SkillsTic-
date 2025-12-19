// DEMO WITHDRAW SCRIPT

function loadWallet(){
  let wallet = Number(localStorage.getItem("wallet")) || 0;
  document.getElementById("walletText").innerText =
    "Current Wallet: ₹" + wallet;
}

function withdraw(){
  let amt = Number(document.getElementById("amount").value);
  let wallet = Number(localStorage.getItem("wallet")) || 0;

  if(!amt || amt <= 0){
    alert("Enter valid amount");
    return;
  }

  if(amt < 100){
    alert("Minimum withdraw is ₹100");
    return;
  }

  if(amt > wallet){
    alert("Insufficient balance");
    return;
  }

  wallet -= amt;
  localStorage.setItem("wallet", wallet);

  alert("₹" + amt + " withdrawal requested (Demo)");
  document.getElementById("amount").value = "";
  loadWallet();
}

// load wallet on page open
window.onload = loadWallet;
