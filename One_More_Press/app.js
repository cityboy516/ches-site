let wallet = null;
let timer = 60;
let pot = 0;
let lastPresser = "None";
let timerInterval = null;

const connectBtn = document.getElementById('connect');
const pressBtn = document.getElementById('press');
const finalizeBtn = document.getElementById('finalize');
const potDisplay = document.getElementById('pot');
const timerDisplay = document.getElementById('timer');
const lastPresserDisplay = document.getElementById('last-presser');

// Mock backend calls for devnet test
async function mockFetchGameState() {
  return {
    pot: pot.toFixed(2),
    timer: timer,
    lastPresser: lastPresser
  };
}

function updateDisplay(state) {
  potDisplay.textContent = `$${state.pot}`;
  timerDisplay.textContent = state.timer;
  lastPresserDisplay.textContent = state.lastPresser;
}

connectBtn.addEventListener('click', async () => {
  if (window.solana && window.solana.isPhantom) {
    const resp = await window.solana.connect();
    wallet = resp.publicKey.toString();
    connectBtn.textContent = `Connected: ${wallet.substring(0, 4)}...`;
    pressBtn.disabled = false;
    finalizeBtn.disabled = false;
    startTimer();
  } else {
    alert('Please install Phantom Wallet');
  }
});

pressBtn.addEventListener('click', async () => {
  pot += 0.60; // $0.10 to pot + $0.50 from seed
  lastPresser = wallet;
  timer = 60;
  const state = await mockFetchGameState();
  updateDisplay(state);
});

finalizeBtn.addEventListener('click', async () => {
  if (timer === 0 && wallet === lastPresser) {
    alert(`You won $${pot.toFixed(2)}!`);
    pot = 0;
    lastPresser = "None";
  } else {
    alert('Cannot finalize yet or you are not the last presser');
  }
  const state = await mockFetchGameState();
  updateDisplay(state);
});

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(async () => {
    if (timer > 0) {
      timer--;
    } else {
      clearInterval(timerInterval);
    }
    const state = await mockFetchGameState();
    updateDisplay(state);
  }, 1000);
}

(async () => {
  const state = await mockFetchGameState();
  updateDisplay(state);
})();
