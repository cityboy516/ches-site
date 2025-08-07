let wallet = null;
let timer = 60;
let pot = 0;
let lastPresser = "None";
let timerInterval = null;
let localSeed = 0;
let globalSeed = 0;

// Config
let config = {
  programId: "",
  activePot: "",
  localSeed: "",
  globalSeed: ""
};

function loadConfig() {
  const saved = localStorage.getItem("buttonGameConfig");
  if (saved) config = JSON.parse(saved);
  document.getElementById('programId').value = config.programId;
  document.getElementById('activePot').value = config.activePot;
  document.getElementById('localSeed').value = config.localSeed;
  document.getElementById('globalSeed').value = config.globalSeed;
}
function saveConfig() {
  config.programId = document.getElementById('programId').value;
  config.activePot = document.getElementById('activePot').value;
  config.localSeed = document.getElementById('localSeed').value;
  config.globalSeed = document.getElementById('globalSeed').value;
  localStorage.setItem("buttonGameConfig", JSON.stringify(config));
  alert("Config saved.");
}
document.getElementById('saveConfig').addEventListener('click', saveConfig);

// Placeholder: Replace with actual Anchor calls
async function fetchGameState() {
  return {
    pot: pot.toFixed(2),
    localSeed: localSeed.toFixed(2),
    globalSeed: globalSeed.toFixed(2),
    timer: timer,
    lastPresser: lastPresser
  };
}

function updateDisplay(state) {
  document.getElementById('pot').textContent = `$${state.pot}`;
  document.getElementById('local-seed').textContent = `$${state.localSeed}`;
  document.getElementById('global-seed').textContent = `$${state.globalSeed}`;
  document.getElementById('timer').textContent = state.timer;
  document.getElementById('last-presser').textContent = state.lastPresser;
}

document.getElementById('connect').addEventListener('click', async () => {
  if (window.solana && window.solana.isPhantom) {
    const resp = await window.solana.connect();
    wallet = resp.publicKey.toString();
    document.getElementById('connect').textContent = `Connected: ${wallet.substring(0, 4)}...`;
    document.getElementById('press').disabled = false;
    document.getElementById('finalize').disabled = false;
    startTimer();
  } else {
    alert('Please install Phantom Wallet');
  }
});

document.getElementById('press').addEventListener('click', async () => {
  pot += 0.60;
  localSeed -= 0.50;
  lastPresser = wallet;
  timer = 60;
  updateDisplay(await fetchGameState());
});

document.getElementById('finalize').addEventListener('click', async () => {
  if (timer === 0 && wallet === lastPresser) {
    alert(`You won $${pot.toFixed(2)}!`);
    pot = 0;
    lastPresser = "None";
  } else {
    alert('Cannot finalize yet or you are not the last presser');
  }
  updateDisplay(await fetchGameState());
});

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(async () => {
    if (timer > 0) timer--;
    updateDisplay(await fetchGameState());
  }, 1000);
}

(async () => {
  loadConfig();
  updateDisplay(await fetchGameState());
})();
