// src/js/main.js
console.log("✅ main.js loaded");

import { showStart } from './start.js';
import { showGame } from './game.js';
import { showSuccess } from './success.js';
import { showFail } from './fail.js';

const app = document.getElementById('app');
if (!app) {
  throw new Error('#app container not found. Make sure index.html has <main id="app"></main>.');
}

// Map of screen names to render functions
const screens = {
  start: showStart,
  game: showGame,
  success: showSuccess,
  fail: showFail,
};

// Central navigation function used by all screens
export function switchScreen(name) {
  const render = screens[name];
  if (!render) {
    console.error(`Unknown screen "${name}" — falling back to start.`);
    return switchScreen('start');
  }
  app.innerHTML = '';
  app.style.position = 'relative'; // needed for absolute-positioned HUD elements in game
  render(app, switchScreen);
}

// Optional: simple hash navigation (e.g., #game, #success)
// Keeps things handy for quick testing; remove if you don’t want it.
function screenFromHash() {
  const h = (location.hash || '').replace('#', '').trim();
  if (h && screens[h]) return h;
  return 'start';
}

window.addEventListener('hashchange', () => switchScreen(screenFromHash()));

// Boot
switchScreen(screenFromHash());
