document.addEventListener("DOMContentLoaded", () => {

  let wallet = parseInt(localStorage.getItem("wallet")) || 0;

  const walletText = document.getElementById("walletText");
  const amountInput = document.getElementById("amount");

  walletText.innerText = "Current Wallet Balance: ₹" + wallet;

  window.deposit = function () {
    let amt = parseInt(amountInput.value);

    if (!amt || amt <= 0) {
      alert("Enter valid amount");
      return;
    }

    wallet += amt;
    localStorage.setItem("wallet", wallet);

    walletText.innerText = "Current Wallet Balance: ₹" + wallet;

    alert("₹" + amt + " deposited successfully!");
    amountInput.value = "";
  };

});
