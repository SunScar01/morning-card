// Step 5: big full-screen cards, the reading lives ON the picked card,
// and the app sends you to the check-in page by itself at lunch and dinner.

// ---------- 1. Date helpers ----------
// Local date like "2026-11-17". Built by hand, because toISOString() uses UTC
// and would flip to "tomorrow" in the evening New York time.
function todayKey() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// ---------- 2. Seeded randomness (same date in, same three cards out) ----------
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

function pickThree(dateKey) {
  const random = mulberry32(hashString(dateKey));
  const pool = [...DECK];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

// ---------- 3. Saved data ----------
const STORAGE_KEY = 'morningCard.picks';
const CHECKIN_KEY = 'morningCard.checkins';

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

function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY)) || [];
  } catch {
    return [];
  }
}

// ---------- 4. "Is it time to ask what you ate?" ----------
// Returns 'lunch' (12:00-15:59), 'dinner' (17:00 onward), or null the rest of the day.
function currentCheckinSlot() {
  const hour = new Date().getHours();
  if (hour >= 12 && hour < 16) return 'lunch';
  if (hour >= 17) return 'dinner';
  return null;
}

// Did you already log this meal today?
function hasCheckinToday(meal) {
  const today = new Date().toDateString();
  return loadCheckins().some((entry) => entry.meal === meal && new Date(entry.at).toDateString() === today);
}

// ---------- 5. Page building ----------
function cardHTML(card, i) {
  return `
    <button class="card" data-index="${i}" aria-label="Card ${i + 1}, face down">
      <span class="card-inner">
        <span class="face back">
          <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="currentColor"/></svg>
          <span class="dots"><i></i><i></i><i></i></span>
        </span>
        <span class="face front" aria-hidden="true">
          <span class="card-icon">${ICONS[card.icon]}</span>
          <span class="card-title">${card.name}</span>
          <span class="card-message">${card.message}</span>
          <span class="card-rule"></span>
          <span class="card-nudge-label">TINY NUDGE</span>
          <span class="card-nudge">${card.nudge}</span>
        </span>
      </span>
    </button>`;
}

function main() {
  const dateKey = todayKey();
  const params = new URLSearchParams(location.search);

  // Testing helper: add ?reset to the URL to wipe saved picks.
  if (params.has('reset')) localStorage.removeItem(STORAGE_KEY);

  const alreadyPicked = loadPicks()[dateKey];

  // Auto-ask: you already flipped today's card, it's lunch or dinner time, and you
  // haven't logged that meal yet -> go straight to the check-in page.
  // Adding ?card to the URL skips this (the nav button uses it).
  if (alreadyPicked !== undefined && !params.has('card')) {
    const slot = currentCheckinSlot();
    if (slot && !hasCheckinToday(slot)) {
      location.replace('checkin.html');
      return;
    }
  }

  const todaysCards = pickThree(dateKey);
  const cardsEl = document.getElementById('cards');
  const subtitleEl = document.getElementById('subtitle');

  document.getElementById('day-label').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() + ' morning';

  cardsEl.innerHTML = todaysCards.map(cardHTML).join('');
  const cardButtons = cardsEl.querySelectorAll('.card');
  let picked = false;

  function reveal(index) {
    const card = todaysCards[index];
    picked = true;
    cardsEl.classList.add('picked');          // CSS collapses the other two cards
    subtitleEl.hidden = true;

    cardButtons.forEach((button, i) => {
      if (i === index) {
        button.classList.add('flipped');
        button.setAttribute('aria-label', `${card.name}. ${card.message} Tiny nudge: ${card.nudge}`);
        button.querySelector('.front').removeAttribute('aria-hidden');
      } else {
        button.setAttribute('aria-hidden', 'true');
        button.tabIndex = -1;
      }
    });
  }

  if (alreadyPicked !== undefined) {
    reveal(alreadyPicked);                    // you already chose today: show it again
  } else {
    cardButtons.forEach((button, i) => {
      button.addEventListener('click', () => {
        if (picked) return;                   // only one pick per day
        savePick(dateKey, i);
        reveal(i);
      });
    });
  }
}

main();