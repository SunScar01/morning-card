// Step 2: pick three cards per day from the deck, let the user choose one,
// and remember that choice so reopening the app shows the same card.

// ---------- 1. Date helpers ----------
// Local date like "2026-11-17". We build it by hand instead of using
// toISOString(), because that uses UTC and would flip to "tomorrow"
// at 7 or 8 PM New York time.
function todayKey() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// ---------- 2. Seeded randomness ----------
// Math.random() gives a different answer every time. We want the SAME three
// cards all day, so we turn the date into a number (hash) and feed it to a
// small random generator (mulberry32). Same date in, same cards out.
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle a copy of the deck with the seeded generator, take the first three.
function pickThree(dateKey) {
  const random = mulberry32(hashString(dateKey));
  const pool = [...DECK];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

// ---------- 3. Saving the choice ----------
// localStorage keeps text on this phone/browser. We store an object like
// { "2026-11-17": 1 } meaning "on that date you picked the 2nd card".
const STORAGE_KEY = 'morningCard.picks';

function loadPicks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function savePick(dateKey, index) {
  const picks = loadPicks();
  picks[dateKey] = index;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
}

// Testing helper: open the page with ?reset on the end of the URL to wipe today's pick.
if (location.search.includes('reset')) {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------- 4. Building the page ----------
const dateKey = todayKey();
const todaysCards = pickThree(dateKey);

const cardsEl = document.getElementById('cards');
const promptEl = document.getElementById('prompt');
const readingEl = document.getElementById('reading');

document.getElementById('day-label').textContent =
  new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() + ' morning';

function cardHTML(card, i) {
  return `
    <button class="card" data-index="${i}" aria-label="Card ${i + 1}, face down">
      <span class="card-inner">
        <span class="face back">
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="currentColor"/></svg>
          <span class="dots"><i></i><i></i><i></i></span>
        </span>
        <span class="face front">
          ${ICONS[card.icon]}
          <span class="card-name">${card.name}</span>
        </span>
      </span>
    </button>`;
}

cardsEl.innerHTML = todaysCards.map(cardHTML).join('');
const cardButtons = cardsEl.querySelectorAll('.card');

// ---------- 5. Revealing a card ----------
function reveal(index) {
  const card = todaysCards[index];

  cardButtons.forEach((button, i) => {
    if (i === index) {
      button.classList.add('flipped');
      button.setAttribute('aria-label', `Card ${i + 1}, ${card.name}, flipped`);
    } else {
      button.classList.add('dimmed');
    }
  });

  document.getElementById('reading-name').textContent = card.name;
  document.getElementById('reading-message').textContent = card.message;
  document.getElementById('reading-nudge').textContent = card.nudge;
  promptEl.hidden = true;
  readingEl.hidden = false;
}

// ---------- 6. Wiring it together ----------
const alreadyPicked = loadPicks()[dateKey];

if (alreadyPicked !== undefined) {
  reveal(alreadyPicked);              // you already chose today: show it again
} else {
  cardButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      savePick(dateKey, i);
      reveal(i);
    });
  });
}
