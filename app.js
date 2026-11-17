// Step 1: just enough JavaScript to flip a card and show its reading.
// In step 2 this gets replaced with the real daily-pick logic.

const cards = document.querySelectorAll('.card');
const prompt = document.getElementById('prompt');
const reading = document.getElementById('reading');
let picked = false;

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (picked) return;          // only one pick allowed
    picked = true;

    card.classList.add('flipped');
    cards.forEach((other) => {
      if (other !== card) other.classList.add('dimmed');
    });

    card.setAttribute('aria-label', `Card ${index + 1}, ${card.dataset.name}, flipped`);

    document.getElementById('reading-name').textContent = card.dataset.name;
    document.getElementById('reading-message').textContent = card.dataset.message;
    document.getElementById('reading-nudge').textContent = card.dataset.nudge;

    prompt.hidden = true;
    reading.hidden = false;
  });
});
