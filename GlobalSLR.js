// ================================================================
// FIREBASE CONFIG
// Replace every value below with your own project's config.
// Get it from: Firebase Console → Project Settings → Your Apps
// ================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBI2DDv7Jf-nuKGOkiWv8h3vj55Klrkakk",
  authDomain: "slrise.firebaseapp.com",
  databaseURL: "https://slrise-default-rtdb.firebaseio.com",
  projectId: "slrise",
  storageBucket: "slrise.firebasestorage.app",
  messagingSenderId: "1017248731611",
  appId: "1:1017248731611:web:7c84af039231e623f857fe",
  measurementId: "G-XQ8S6L3R2Q"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================================================================
// Constants
// ================================================================
const VILLAGER_NAMES = {
  one:   'Provakar',
  two:   'Gajamati',
  three: 'Naisha',
  four:  'Debesh',
  five:  'Nayyaab'
};
const KEYS = ['one', 'two', 'three', 'four', 'five'];
const CAP  = { one: 'One', two: 'Two', three: 'Three', four: 'Four', five: 'Five' };

// ================================================================
// Session state
// ================================================================
let myPlayerId = localStorage.getItem('slrPlayerId');
if (!myPlayerId) {
  myPlayerId = Math.random().toString(36).substr(2, 9);
  localStorage.setItem('slrPlayerId', myPlayerId);
}

let myName           = '';
let myVillager       = null;
let roomId           = null;
let amHost           = false;
let isProcessingTurn = false;
let lastShownEvent   = null;
let localGameState   = null;
let localPlayers     = null;

// ================================================================
// Lobby — name entry
// ================================================================
function goToLobbyOptions() {
  const name = document.getElementById('playerName').value.trim();
  if (!name) { alert('Please enter a name.'); return; }
  myName = name;
  document.getElementById('enterName').style.display    = 'none';
  document.getElementById('lobbyOptions').style.display = 'block';
}

// ================================================================
// Room code
// ================================================================
function genRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

// ================================================================
// Create room (host)
// ================================================================
async function createRoom() {
  roomId    = genRoomCode();
  amHost    = true;
  myVillager = 'one';

  await db.ref('rooms/' + roomId).set({
    state: 'lobby',
    host:  myPlayerId,
    players: {
      [myPlayerId]: { name: myName, villager: 'one', readyForNextTurn: false, alive: true }
    }
  });

  db.ref(`rooms/${roomId}/players/${myPlayerId}`).onDisconnect().remove();
  showWaitingRoom();
  subscribeToRoom();
}

// ================================================================
// Join room
// ================================================================
async function joinRoom() {
  const code = document.getElementById('joinCode').value.trim().toUpperCase();
  if (!code) { showLobbyError('Enter a room code.'); return; }

  const snap = await db.ref('rooms/' + code).once('value');
  if (!snap.exists())               { showLobbyError('Room not found.'); return; }

  const room    = snap.val();
  if (room.state !== 'lobby')       { showLobbyError('That game is already in progress.'); return; }

  const players = room.players || {};
  if (Object.keys(players).length >= 5) { showLobbyError('Room is full (max 5 players).'); return; }

  const taken     = Object.values(players).map(p => p.villager);
  const available = KEYS.filter(k => !taken.includes(k));
  if (!available.length)            { showLobbyError('No villagers available.'); return; }

  myVillager = available[0];
  roomId     = code;

  await db.ref(`rooms/${roomId}/players/${myPlayerId}`).set({
    name: myName, villager: myVillager, readyForNextTurn: false, alive: true
  });
  db.ref(`rooms/${roomId}/players/${myPlayerId}`).onDisconnect().remove();

  showWaitingRoom();
  subscribeToRoom();
}

function showLobbyError(msg) {
  document.getElementById('lobbyError').textContent = msg;
}

// ================================================================
// Waiting room UI
// ================================================================
function showWaitingRoom() {
  document.getElementById('lobbyOptions').style.display  = 'none';
  document.getElementById('waitingRoom').style.display   = 'block';
  document.getElementById('roomCodeDisplay').textContent = roomId;
  if (amHost) {
    document.getElementById('startButton').style.display = 'inline-block';
    document.getElementById('waitingMsg').style.display  = 'none';
  }
}

function updateWaitingRoomUI(players) {
  const list = document.getElementById('playerList');
  list.innerHTML = '';
  Object.values(players).forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.name} — ${VILLAGER_NAMES[p.villager]}`;
    list.appendChild(li);
  });
}

// ================================================================
// Start game (host only)
// ================================================================
async function startGame() {
  if (!amHost) return;
  const gameData = buildInitialGameState();
  await db.ref('rooms/' + roomId).update({ state: 'playing', gameData });
}

function buildInitialGameState() {
  const rX = () => Math.floor(Math.random() * 850) + 200;
  const rY = () => Math.floor(Math.random() * 500) + 20;

  const houses = {}, gardens = {}, mangroves = {}, villagers = {};
  KEYS.forEach(k => {
    houses[k]    = { x: rX(), y: rY(), alive: true };
    gardens[k]   = { x: rX(), y: rY(), alive: true };
    mangroves[k] = { planted: false, x: 0, y: 0 };
    villagers[k] = { acted: false };
  });

  return {
    waterWidth: 100,
    wallLeft:   700,
    wallHeight: 0,
    wallVisible: false,
    brickAmount: 0,
    foodAmount:  5,
    speed:       50,
    lastEvent:   null,
    houses, gardens, mangroves, villagers
  };
}

// ================================================================
// Firebase subscription
// ================================================================
function subscribeToRoom() {
  db.ref('rooms/' + roomId).on('value', snap => {
    if (!snap.exists()) return;
    const room      = snap.val();
    localPlayers    = room.players   || {};
    localGameState  = room.gameData  || null;

    if (room.state === 'lobby') {
      updateWaitingRoomUI(localPlayers);

    } else if (room.state === 'playing') {
      if (document.getElementById('lobby').style.display !== 'none') launchGameScreen();
      renderGame(localGameState, localPlayers);
      if (amHost && !isProcessingTurn) checkAndProcessEndOfTurn(localGameState, localPlayers);

    } else if (room.state === 'ended') {
      if (document.getElementById('lobby').style.display !== 'none') launchGameScreen();
      renderGame(localGameState, localPlayers);
      showGameOver(room.gameResult);
    }
  });
}

// ================================================================
// Launch game screen
// ================================================================
function launchGameScreen() {
  document.getElementById('lobby').style.display      = 'none';
  document.getElementById('gameScreen').style.display = 'block';
  document.getElementById('myVillagerLabel').textContent =
    'You control: ' + VILLAGER_NAMES[myVillager];
  KEYS.forEach(k => {
    document.getElementById('peopleList' + CAP[k]).textContent = VILLAGER_NAMES[k];
  });
}

// ================================================================
// Render
// ================================================================
function renderGame(gs, players) {
  if (!gs) return;

  document.getElementById('water').style.width = gs.waterWidth + 'px';

  const wallEl = document.getElementById('wall');
  wallEl.style.display = gs.wallVisible ? 'block' : 'none';
  wallEl.style.left    = gs.wallLeft   + 'px';
  wallEl.style.height  = gs.wallHeight + 'px';

  document.getElementById('brickAmount').value = gs.brickAmount;
  document.getElementById('foodAmount').value  = gs.foodAmount;

  KEYS.forEach(k => {
    const h       = gs.houses[k];
    const g       = gs.gardens[k];
    const m       = gs.mangroves[k];
    const acted   = gs.villagers[k].acted;
    const canAct  = (k === myVillager) && h.alive && !acted;

    // House
    const hEl = document.getElementById('house' + CAP[k]);
    hEl.style.display = h.alive ? 'block' : 'none';
    if (h.alive) { hEl.style.left = h.x + 'px'; hEl.style.top = h.y + 'px'; }

    // Garden
    const gEl = document.getElementById('garden' + CAP[k]);
    gEl.style.display = g.alive ? 'block' : 'none';
    if (g.alive) { gEl.style.left = g.x + 'px'; gEl.style.top = g.y + 'px'; }

    // Mangrove
    const mEl = document.getElementById('mangroveImage' + CAP[k]);
    mEl.style.display = m.planted ? 'block' : 'none';
    if (m.planted) { mEl.style.left = m.x + 'px'; mEl.style.top = m.y + 'px'; }

    // Villager label
    document.getElementById('peopleList' + CAP[k]).style.display = h.alive ? 'block' : 'none';

    // Action buttons
    const bBtn = document.getElementById(k + 'Bricks');
    const fBtn = document.getElementById(k + 'Food');
    const pBtn = document.getElementById(k + 'Mangrove');

    bBtn.style.display = h.alive ? 'block' : 'none';
    fBtn.style.display = h.alive ? 'block' : 'none';
    pBtn.style.display = (h.alive && !m.planted) ? 'block' : 'none';

    bBtn.disabled = !canAct;
    fBtn.disabled = !canAct;
    pBtn.disabled = !canAct;
  });

  // End Turn button
  const me      = players[myPlayerId];
  const iReady  = me && me.readyForNextTurn;
  const endBtn  = document.getElementById('endTurn');
  endBtn.disabled    = iReady;
  endBtn.textContent = iReady ? 'Waiting...' : 'End Turn';

  const readyCount = Object.values(players).filter(p => p.readyForNextTurn && p.alive).length;
  const aliveCount = Object.values(players).filter(p => p.alive).length;
  document.getElementById('endTurnStatus').textContent = readyCount + '/' + aliveCount + ' ready';

  // Random event notification
  if (gs.lastEvent && gs.lastEvent !== lastShownEvent) {
    lastShownEvent = gs.lastEvent;
    setTimeout(() => alert(gs.lastEvent), 200);
  }
}

// ================================================================
// Player actions — all go through Firebase transactions
// ================================================================
function doMakeBricks(k) {
  if (k !== myVillager || !localGameState) return;
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.villagers[k].acted || !gs.houses[k].alive) return;
    gs.brickAmount += 1;
    gs.villagers[k].acted = true;
    return gs;
  });
}

function doMakeFood(k) {
  if (k !== myVillager || !localGameState) return;
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.villagers[k].acted || !gs.houses[k].alive) return;
    gs.foodAmount += 1;
    gs.villagers[k].acted = true;
    return gs;
  });
}

function doPlantMangrove(k) {
  if (k !== myVillager || !localGameState) return;
  if (localGameState.foodAmount < 2) { alert('Need 2 food to plant a mangrove.'); return; }
  const mx = Math.floor(Math.random() * 850) + 200;
  const my = Math.floor(Math.random() * 500) + 20;
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.villagers[k].acted || !gs.houses[k].alive || gs.mangroves[k].planted) return;
    if (gs.foodAmount < 2) return;
    gs.foodAmount       -= 2;
    gs.mangroves[k]      = { planted: true, x: mx, y: my };
    gs.speed             = Math.max(5, gs.speed - 7);
    gs.villagers[k].acted = true;
    return gs;
  });
}

function doBuildWall() {
  if (!localGameState || localGameState.brickAmount < 3) {
    alert('Need 3 bricks to build/extend the wall.'); return;
  }
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.brickAmount < 3) return;
    gs.brickAmount -= 3;
    gs.wallHeight  += 50;
    gs.wallVisible  = true;
    return gs;
  });
}

function doMoveWallLeft() {
  if (!localGameState || localGameState.brickAmount < 1) {
    alert('Need 1 brick to move the wall.'); return;
  }
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.brickAmount < 1) return;
    gs.brickAmount -= 1;
    gs.wallLeft    -= 50;
    return gs;
  });
}

function doMoveWallRight() {
  if (!localGameState || localGameState.brickAmount < 1) {
    alert('Need 1 brick to move the wall.'); return;
  }
  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs || gs.brickAmount < 1) return;
    gs.brickAmount -= 1;
    gs.wallLeft    += 50;
    return gs;
  });
}

function voteEndTurn() {
  if (!localPlayers || !localPlayers[myPlayerId]) return;
  if (localPlayers[myPlayerId].readyForNextTurn) return;
  db.ref(`rooms/${roomId}/players/${myPlayerId}/readyForNextTurn`).set(true);
}

// ================================================================
// End-of-turn processing (host only)
// ================================================================
function checkAndProcessEndOfTurn(gs, players) {
  if (!gs || !players) return;
  const alive = Object.values(players).filter(p => p.alive);
  if (!alive.length || !alive.every(p => p.readyForNextTurn)) return;

  isProcessingTurn = true;

  // Compute random values before the transaction — transactions can retry
  const eventRoll = Math.floor(Math.random() * 50);
  const event     = computeRandomEvent(eventRoll);
  const capturedPlayers = players;

  db.ref('rooms/' + roomId + '/gameData').transaction(gs => {
    if (!gs) return gs;

    // --- Advance water (blocked by a wall that spans full height) ---
    const fullyBlocked = gs.wallVisible && gs.wallHeight >= 565 && gs.waterWidth >= gs.wallLeft;
    if (!fullyBlocked) gs.waterWidth += gs.speed;

    // --- Random event ---
    if (event) {
      if (event.extraAdvances) {
        for (let i = 0; i < event.extraAdvances; i++) {
          const stillBlocked = gs.wallVisible && gs.wallHeight >= 565 && gs.waterWidth >= gs.wallLeft;
          if (!stillBlocked) gs.waterWidth += gs.speed;
        }
      }
      if (event.bricks) gs.brickAmount = Math.max(0, gs.brickAmount + event.bricks);
      if (event.food)   gs.foodAmount  = Math.max(0, gs.foodAmount  + event.food);
      gs.lastEvent = event.message;
    } else {
      gs.lastEvent = null;
    }

    // --- Flood houses and gardens ---
    KEYS.forEach(k => {
      if (gs.houses[k].alive  && gs.waterWidth > gs.houses[k].x)  gs.houses[k].alive  = false;
      if (gs.gardens[k].alive && gs.waterWidth > gs.gardens[k].x) gs.gardens[k].alive = false;
    });

    // --- Garden food income: 1 per surviving garden ---
    const aliveGardens = KEYS.filter(k => gs.gardens[k].alive).length;
    gs.foodAmount += aliveGardens;

    // --- Reset villager action flags ---
    KEYS.forEach(k => { gs.villagers[k].acted = false; });

    return gs;

  }, async (error, committed, snap) => {
    if (error || !committed) { isProcessingTurn = false; return; }

    const gs = snap.val();

    // Update each player's alive status and clear their ready vote
    const updates = {};
    Object.entries(capturedPlayers).forEach(([pid, p]) => {
      if (!gs.houses[p.villager].alive) {
        updates[`rooms/${roomId}/players/${pid}/alive`] = false;
      }
      updates[`rooms/${roomId}/players/${pid}/readyForNextTurn`] = false;
    });
    await db.ref().update(updates);

    // --- Win / lose ---
    const allHousesDead = KEYS.every(k => !gs.houses[k].alive);
    const noFood        = gs.foodAmount <= 0;
    const waterWon      = gs.wallVisible && gs.wallHeight >= 565 && gs.waterWidth >= gs.wallLeft;

    if (allHousesDead || noFood) {
      await db.ref('rooms/' + roomId).update({ state: 'ended', gameResult: 'lose' });
    } else if (waterWon) {
      await db.ref('rooms/' + roomId).update({ state: 'ended', gameResult: 'win' });
    }

    isProcessingTurn = false;
  });
}

// ================================================================
// Random events
// ================================================================
function computeRandomEvent(n) {
  if ([0, 1, 2, 4].includes(n))
    return { message: 'Monsoon! The sea surged forward three times!', extraAdvances: 3 };
  if ([5, 6, 7].includes(n))
    return { message: 'Flooding! An extra wave hit this turn!', extraAdvances: 1 };
  if (n === 13)
    return { message: 'Resource Donation! +15 bricks!', bricks: 15 };
  if ([14, 15].includes(n))
    return { message: 'Food Donation! +10 food!', food: 10 };
  if ([11, 12].includes(n))
    return { message: 'Salt Water Intrusion! Your crops lost 3 food.', food: -3 };
  if (n === 8)
    return { message: 'Fact: Bangladesh is one of the countries most prone to the effects of sea level rise.' };
  if (n === 9)
    return { message: 'Fact: Over 70% of Bangladesh\'s land area is less than 1 meter above sea level.' };
  if (n === 10)
    return { message: 'Fact: Monsoon season and sea level rise together greatly increase Bangladesh\'s flood risk.' };
  return null;
}

// ================================================================
// Game over screen
// ================================================================
function showGameOver(result) {
  const overlay = document.getElementById('gameOverOverlay');
  document.getElementById('gameOverMsg').textContent = result === 'win'
    ? 'You Win! Your wall held back the sea and saved the village!'
    : 'Game Over. Your village was lost to the rising waters.';
  overlay.style.display = 'flex';
}

// ================================================================
// Instructions overlay
// ================================================================
function instruct() {
  document.getElementById('black').style.display       = 'none';
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('instructButt').style.display = 'none';
}

