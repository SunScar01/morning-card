// The "judge". Pure logic: text in, snarky sentence out.
// Add more lines to any list to make it funnier. Keep it playful, not mean about bodies or weight.

const ROASTS = {
  empty: [
    'Nothing? Bold strategy. Go eat something real and come back.',
    'You typed nothing. The judge is unimpressed and a little worried.'
  ],
  skipped: [
    'Skipping meals is not a personality. Go eat something, then come back.',
    'Running on vibes alone? Eat something real, then we talk.'
  ],
  drinksOnly: [
    'That is a beverage, not a meal. Try again with some actual food.',
    'Liquid lunch? Bold. Your stomach would like a word.'
  ],
  mixed: [
    'Veggies AND a questionable side? Balanced in the most chaotic way possible.',
    'A plant and a guilty pleasure on one plate. The judge respects the range.'
  ],
  veggies: [
    'A plant made it onto your plate. Proud of you, quietly. Keep it going.',
    'Look at you eating produce like a functioning adult. Not bad at all.'
  ],
  junk: [
    'Bold choices. Your future self just sighed. Add one vegetable tomorrow and we are friends again.',
    'The judge has seen worse, but not much worse. Do better, honestly.'
  ],
  protein: [
    'Real protein on the plate. The judge nods slowly. Add a vegetable and it is a good day.',
    'Okay, that is an actual meal. Respect. Now somebody get you a fruit.'
  ],
  fallback: [
    'Not bad. A bit healthier than a child. Do better, honestly.',
    'Acceptable. Not impressive, not alarming. The judge reserves final comment.'
  ]
};

const WORDS = {
  skipped: /\b(skip(ped)?|nothing|didn'?t eat|haven'?t eaten|no food|forgot to eat)\b/,
  drink: /\b(coffee|tea|soda|cola|energy|monster|red ?bull|boba|juice|latte|water|smoothie)\b/,
  veggies: /\b(veg(gie|getable)?s?|salad|fruit|apple|banana|orange|spinach|broccoli|carrot|berr(y|ies)|cucumber|tomato|peas|beans|corn)\b/,
  junk: /\b(chips|pizza|candy|soda|fries|cookie|cookies|ramen|noodles|cake|burger|donut|ice ?cream|nuggets|fast ?food)\b/,
  protein: /\b(chicken|egg|eggs|fish|tofu|beef|paneer|lentils?|dal|turkey|salmon|tuna|yogurt)\b/
};

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function roastFor(text) {
  const t = text.toLowerCase().trim();
  if (!t) return randomFrom(ROASTS.empty);
  if (WORDS.skipped.test(t)) return randomFrom(ROASTS.skipped);

  // Split "rice, chicken and coffee" into separate items
  const items = t.split(/,|\band\b|\+|&/).map((s) => s.trim()).filter(Boolean);
  const drinksOnly = items.every((item) => WORDS.drink.test(item));
  if (drinksOnly) return randomFrom(ROASTS.drinksOnly);

  const veg = WORDS.veggies.test(t);
  const junk = WORDS.junk.test(t);
  if (veg && junk) return randomFrom(ROASTS.mixed);
  if (veg) return randomFrom(ROASTS.veggies);
  if (junk) return randomFrom(ROASTS.junk);
  if (WORDS.protein.test(t)) return randomFrom(ROASTS.protein);
  return randomFrom(ROASTS.fallback);
}
