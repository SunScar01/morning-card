// Step 3: the food check-in. Type what you ate, get judged, and it saves to a history.

const CHECKIN_KEY = 'morningCard.checkins';

function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCheckin(entry) {
  const all = loadCheckins();
  all.unshift(entry);                       // newest first
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(all.slice(0, 100)));
}

function mealName() {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  return 'dinner';
}

// ---------- Page elements ----------
const input = document.getElementById('food-input');
const judgeButton = document.getElementById('judge-button');
const verdictBox = document.getElementById('verdict');
const verdictText = document.getElementById('verdict-text');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');

document.getElementById('meal-label').textContent = mealName() + ' check-in';

// ---------- History ----------
// Notice we use textContent, not innerHTML, for anything the user typed.
// innerHTML would treat typed text as real HTML, which is a classic security bug.
function renderHistory() {
  const entries = loadCheckins();
  historyList.replaceChildren();
  historyEmpty.hidden = entries.length > 0;

  entries.slice(0, 10).forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const when = new Date(entry.at);
    const meta = document.createElement('p');
    meta.className = 'history-meta';
    meta.textContent =
      when.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
      ' · ' + entry.meal;

    const food = document.createElement('p');
    food.className = 'history-food';
    food.textContent = entry.text;

    const verdict = document.createElement('p');
    verdict.className = 'history-verdict';
    verdict.textContent = entry.verdict;

    li.append(meta, food, verdict);
    historyList.appendChild(li);
  });
}

// ---------- Judging ----------
judgeButton.addEventListener('click', () => {
  const text = input.value.trim();
  const verdict = roastFor(text);

  verdictText.textContent = verdict;
  verdictBox.hidden = false;

  if (text) {                               // don't save empty entries
    saveCheckin({ at: Date.now(), meal: mealName(), text, verdict });
    renderHistory();
    input.value = '';
  }
});

renderHistory();
