export function showStart(container, switchScreen) {
    const wrap = document.createElement('section');
    wrap.className = 'screen';
    wrap.innerHTML = `
    <h1>Pizza Maker</h1>
    <p>Press Start to begin!</p>
  `;
    const btn = document.createElement('button');
    btn.textContent = 'Start Game';
    btn.onclick = () => switchScreen('game');
    wrap.appendChild(btn);
    container.appendChild(wrap);
}
