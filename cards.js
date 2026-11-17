// The deck. Add, remove, or rewrite cards here, nothing else needs to change.
// Each card needs: id, icon (one of the keys in ICONS), name, message, nudge.

const ICONS = {
  sun: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>',
  key: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16 7l3 3M14 9l2 2"/></svg>',
  moon: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>',
  star: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  leaf: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z"/><path d="M5 19c3-5 6-8 10-10"/></svg>',
  cup: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 9h12v4a6 6 0 0 1-12 0z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v2M11 3v2M14 3v2"/></svg>'
};

const DECK = [
  { id: 1,  icon: 'sun',  name: 'The Slow Sun',     message: 'Nothing has to be impressive today. A steady day beats a perfect one.', nudge: 'Finish one real thing before noon, then see how you feel.' },
  { id: 2,  icon: 'key',  name: 'The Small Key',    message: 'The thing you keep avoiding is smaller than it looks. Today it opens easily.', nudge: 'Give the avoided task ten minutes. Set a timer and just start.' },
  { id: 3,  icon: 'moon', name: 'The Quiet Moon',   message: 'Good ideas show up when you stop forcing them. Leave a little room for one.', nudge: 'Take a short walk with your phone in your pocket.' },
  { id: 4,  icon: 'star', name: 'The Lucky Break',  message: 'Something small is going to go your way today. Stay loose enough to notice it.', nudge: 'Say yes to one thing you would normally skip.' },
  { id: 5,  icon: 'leaf', name: 'The Fresh Start',  message: 'Yesterday is finished. You get to start this one without carrying the old mood.', nudge: 'Tidy one small corner of your space before you leave.' },
  { id: 6,  icon: 'cup',  name: 'The Warm Cup',     message: 'Take it easy on yourself today. Rest is part of the work, not the opposite of it.', nudge: 'Eat something real and drink some water before anything else.' },
  { id: 7,  icon: 'sun',  name: 'The Early Light',  message: 'You are further along than it feels. Look at what you finished this month.', nudge: 'Write down one thing you got done recently.' },
  { id: 8,  icon: 'key',  name: 'The Open Door',    message: 'A door you thought was closed is only stuck. Ask the question you have been holding.', nudge: 'Send the message or email you have been putting off.' },
  { id: 9,  icon: 'moon', name: 'The Night Owl',    message: 'Your weird hours and odd ideas are not a flaw. Use them on purpose today.', nudge: 'Work on the interesting thing first, not the easy thing.' },
  { id: 10, icon: 'star', name: 'The Big Maybe',    message: 'You do not need the whole plan today. Just the next step, and the courage to take it.', nudge: 'Write the very next step on a sticky note.' },
  { id: 11, icon: 'leaf', name: 'The Slow Growth',  message: 'Progress is quiet most days. That is how it usually looks while it is working.', nudge: 'Do one small, boring thing that future you will thank you for.' },
  { id: 12, icon: 'cup',  name: 'The Good Company', message: 'Someone would love to hear from you today. Do not wait for a reason.', nudge: 'Text one person just to say hi.' }
];
